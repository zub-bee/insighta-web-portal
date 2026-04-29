import { initAuth } from "../auth.js";
import { createLayout } from "../layout.js";
import { api } from "../api.js";
import {
  renderProfilesTable,
  renderPagination,
  renderPaginationSkeleton,
} from "../components.js";

/* global lucide */

const AGE_GROUPS = ["child", "teen", "adult", "senior"];
const GENDERS = ["male", "female"];
const SORT_OPTIONS = [
  { value: "created_at", label: "Date Added" },
  { value: "age", label: "Age" },
  { value: "gender_probability", label: "Gender Probability" },
];
const LIMIT_OPTIONS = [10, 25, 50];

// Page state
let page = 1;
let limit = 10;
let sortBy = "created_at";
let order = "desc";
let showFilters = false;
let filters = {
  gender: "",
  age_group: "",
  country_id: "",
  min_age: "",
  max_age: "",
  min_gender_probability: "",
  min_country_probability: "",
};

let contentEl = null;

async function init() {
  const user = await initAuth();
  if (!user) return;

  contentEl = createLayout("profiles");
  await loadAndRender();
}

function buildParams() {
  const params = { page, limit, sort_by: sortBy, order };
  if (filters.gender) params.gender = filters.gender;
  if (filters.age_group) params.age_group = filters.age_group;
  if (filters.country_id) params.country_id = filters.country_id;
  if (filters.min_age) params.min_age = Number(filters.min_age);
  if (filters.max_age) params.max_age = Number(filters.max_age);
  if (filters.min_gender_probability)
    params.min_gender_probability = Number(filters.min_gender_probability);
  if (filters.min_country_probability)
    params.min_country_probability = Number(filters.min_country_probability);
  return params;
}

async function loadAndRender() {
  renderShell(true);

  try {
    const data = await api.getProfiles(buildParams());
    renderShell(false, data);
  } catch {
    contentEl.innerHTML = '<p class="text-error">Failed to load profiles.</p>';
  }
}

function renderShell(isLoading, data) {
  const profiles = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Sort & limit bar options
  const sortOptionsHtml = SORT_OPTIONS.map(
    (o) =>
      `<option value="${o.value}" ${sortBy === o.value ? "selected" : ""}>${o.label}</option>`,
  ).join("");
  const limitOptionsHtml = LIMIT_OPTIONS.map(
    (n) =>
      `<option value="${n}" ${limit === n ? "selected" : ""}>${n}</option>`,
  ).join("");

  // Filter panel
  const genderOptionsHtml = GENDERS.map(
    (g) =>
      `<option value="${g}" ${filters.gender === g ? "selected" : ""}>${g.charAt(0).toUpperCase() + g.slice(1)}</option>`,
  ).join("");
  const ageGroupOptionsHtml = AGE_GROUPS.map(
    (g) =>
      `<option value="${g}" ${filters.age_group === g ? "selected" : ""}>${g.charAt(0).toUpperCase() + g.slice(1)}</option>`,
  ).join("");

  const filterPanelHtml = showFilters
    ? `
    <div class="card bg-base-100 shadow-sm mb-6" id="filter-panel">
      <div class="card-body gap-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-sm">Filter Profiles</h3>
          ${activeFilterCount > 0 ? '<button class="btn btn-ghost btn-xs gap-1" id="clear-filters-btn"><i data-lucide="x" style="width:14px;height:14px"></i> Clear all</button>' : ""}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Gender</span></label>
            <select title="Filter by gender" class="select select-bordered select-sm" data-filter="gender">
              <option value="">All</option>
              ${genderOptionsHtml}
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Age Group</span></label>
            <select title="Filter by age group" class="select select-bordered select-sm" data-filter="age_group">
              <option value="">All</option>
              ${ageGroupOptionsHtml}
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Country Code</span></label>
            <input type="text" placeholder="e.g. NG, US" class="input input-bordered input-sm uppercase" maxlength="2" data-filter="country_id" value="${filters.country_id}" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Age Range</span></label>
            <div class="flex gap-2">
              <input type="number" placeholder="Min" class="input input-bordered input-sm w-full" min="0" max="120" data-filter="min_age" value="${filters.min_age}" />
              <input type="number" placeholder="Max" class="input input-bordered input-sm w-full" min="0" max="120" data-filter="max_age" value="${filters.max_age}" />
            </div>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Min Gender Probability</span></label>
            <input type="number" placeholder="0.0 – 1.0" class="input input-bordered input-sm" min="0" max="1" step="0.05" data-filter="min_gender_probability" value="${filters.min_gender_probability}" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text text-xs">Min Country Probability</span></label>
            <input type="number" placeholder="0.0 – 1.0" class="input input-bordered input-sm" min="0" max="1" step="0.05" data-filter="min_country_probability" value="${filters.min_country_probability}" />
          </div>
        </div>
      </div>
    </div>`
    : "";

  const tableHtml = isLoading
    ? renderProfilesTable([], { isLoading: true, skeletonRows: limit })
    : renderProfilesTable(profiles);

  const paginationHtml = isLoading
    ? renderPaginationSkeleton()
    : totalPages > 1
      ? renderPagination(page, totalPages, total, limit)
      : "";

  contentEl.innerHTML = `
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1>Profiles</h1>
          <p class="text-base-content/60">${isLoading ? "…" : `${total} profiles found`}</p>
        </div>
        <button class="btn btn-sm gap-2 ${showFilters ? "btn-primary" : "btn-ghost"}" id="toggle-filters-btn">
          <i data-lucide="sliders-horizontal" style="width:16px;height:16px"></i>
          Filters
          ${activeFilterCount > 0 ? `<span class="badge badge-sm badge-secondary">${activeFilterCount}</span>` : ""}
        </button>
      </div>

      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <span class="text-sm text-base-content/60">Sort by</span>
        <select title="Sort field" class="select select-bordered select-sm w-44" id="sort-by-select">
          ${sortOptionsHtml}
        </select>
        <select title="Sort order" class="select select-bordered select-sm w-28" id="order-select">
          <option value="asc" ${order === "asc" ? "selected" : ""}>Asc</option>
          <option value="desc" ${order === "desc" ? "selected" : ""}>Desc</option>
        </select>
        <div class="ml-auto flex items-center gap-2">
          <span class="text-sm text-base-content/60">Show</span>
          <select title="Results per page" class="select select-bordered select-sm w-20" id="limit-select">
            ${limitOptionsHtml}
          </select>
          <span class="text-sm text-base-content/60">per page</span>
        </div>
      </div>

      ${filterPanelHtml}

      <div id="table-area">${tableHtml}</div>
      <div id="pagination-area">${paginationHtml}</div>
    </div>`;

  lucide.createIcons();
  wireEvents();
}

function wireEvents() {
  // Toggle filters
  document
    .getElementById("toggle-filters-btn")
    ?.addEventListener("click", () => {
      showFilters = !showFilters;
      loadAndRender();
    });

  // Sort & order & limit
  document.getElementById("sort-by-select")?.addEventListener("change", (e) => {
    sortBy = e.target.value;
    page = 1;
    loadAndRender();
  });
  document.getElementById("order-select")?.addEventListener("change", (e) => {
    order = e.target.value;
    page = 1;
    loadAndRender();
  });
  document.getElementById("limit-select")?.addEventListener("change", (e) => {
    limit = Number(e.target.value);
    page = 1;
    loadAndRender();
  });

  // Filter inputs
  document.querySelectorAll("[data-filter]").forEach((el) => {
    const key = el.dataset.filter;
    const event = "change";
    el.addEventListener(event, (e) => {
      let val = e.target.value;
      if (key === "country_id") val = val.toUpperCase();
      filters[key] = val;
      page = 1;
      loadAndRender();
    });
  });

  // Clear filters
  document
    .getElementById("clear-filters-btn")
    ?.addEventListener("click", () => {
      filters = {
        gender: "",
        age_group: "",
        country_id: "",
        min_age: "",
        max_age: "",
        min_gender_probability: "",
        min_country_probability: "",
      };
      page = 1;
      loadAndRender();
    });

  // Pagination
  document.getElementById("pagination-bar")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    page = Number(btn.dataset.page);
    loadAndRender();
  });
}

init();
