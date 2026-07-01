import { initAuth } from "../auth.js";
import { createLayout } from "../layout.js";
import { api } from "../api.js";
import {
  renderProfilesTable,
  renderPagination,
  renderPaginationSkeleton,
} from "../components.js";

/* global lucide */

const SORT_OPTIONS = [
  { value: "created_at", label: "Date Added" },
  { value: "age", label: "Age" },
  { value: "gender_probability", label: "Gender Probability" },
];
const LIMIT_OPTIONS = [10, 25, 50];

const EXAMPLE_QUERIES = [
  "females from Nigeria above 30",
  "male adults from United States",
  "teenagers below 16",
  "adults from Germany with above 40",
];

let input = "";
let query = "";
let page = 1;
let sortBy = "created_at";
let order = "desc";
let limit = 10;

let contentEl = null;

async function init() {
  const user = await initAuth();
  if (!user) return;

  contentEl = createLayout("search");
  renderPage();
}

async function doSearch() {
  if (!query) {
    renderPage();
    return;
  }

  renderPage(true);

  try {
    const data = await api.searchProfiles({
      q: query,
      page,
      limit,
      sort_by: sortBy,
      order,
    });
    renderPage(false, data);
  } catch {
    contentEl.innerHTML = '<p class="text-error">Search failed.</p>';
  }
}

function renderPage(isLoading = false, data = null) {
  const results = data?.data ?? [];
  const total = Number(data?.total ?? 0);
  const responseLimit = Number(data?.limit ?? limit);
  const rawTotalPages = Number(
    data?.total_pages ?? data?.pagination?.total_pages ?? 0,
  );
  const totalPages =
    rawTotalPages > 0
      ? rawTotalPages
      : Math.max(1, Math.ceil(total / (responseLimit || limit || 10)));

  // Example query badges
  const examplesHtml = EXAMPLE_QUERIES.map(
    (ex) =>
      `<button class="badge badge-outline badge-sm cursor-pointer hover:badge-primary transition-colors" data-example="${ex}">${ex}</button>`,
  ).join("");

  // Sort & limit controls
  const sortOptionsHtml = SORT_OPTIONS.map(
    (o) =>
      `<option value="${o.value}" ${sortBy === o.value ? "selected" : ""}>${o.label}</option>`,
  ).join("");
  const limitOptionsHtml = LIMIT_OPTIONS.map(
    (n) =>
      `<option value="${n}" ${limit === n ? "selected" : ""}>${n}</option>`,
  ).join("");

  let resultsHtml = "";

  if (isLoading) {
    resultsHtml = `
      <div class="mb-4">
        <div class="skeleton h-6 w-36 mb-2"></div>
        <div class="skeleton h-4 w-28"></div>
      </div>
      ${renderProfilesTable([], { isLoading: true, skeletonRows: 6 })}
      ${renderPaginationSkeleton()}`;
  } else if (query) {
    if (results.length === 0) {
      resultsHtml = `
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body text-center py-12">
            <p class="text-base-content/60">No profiles found matching your search</p>
          </div>
        </div>`;
    } else {
      const sortControlsHtml = `
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm text-base-content/60">Sort by</span>
          <select title="Sort field" class="select select-bordered select-sm w-44" id="sort-by-select">${sortOptionsHtml}</select>
          <select title="Sort order" class="select select-bordered select-sm w-28" id="order-select">
            <option value="asc" ${order === "asc" ? "selected" : ""}>Asc</option>
            <option value="desc" ${order === "desc" ? "selected" : ""}>Desc</option>
          </select>
          <span class="text-sm text-base-content/60 ml-2">Show</span>
          <select title="Results per page" class="select select-bordered select-sm w-20" id="limit-select">${limitOptionsHtml}</select>
        </div>`;

      resultsHtml = `
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2>Search Results</h2>
            <p class="text-base-content/60">${total} profiles found</p>
          </div>
          ${sortControlsHtml}
        </div>
        ${renderProfilesTable(results)}
        ${totalPages > 1 ? renderPagination(page, totalPages, total, responseLimit || limit) : ""}`;
    }
  } else {
    resultsHtml = `
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body text-center py-12">
          <i data-lucide="search" style="width:48px;height:48px" class="mx-auto text-base-content/30 mb-4"></i>
          <p class="text-lg font-medium mb-1">Natural Language Search</p>
          <p class="text-base-content/60 max-w-md mx-auto">
            Describe the profiles you're looking for in plain English — filter by gender, age, country, and more.
          </p>
        </div>
      </div>`;
  }

  contentEl.innerHTML = `
    <div>
      <div class="mb-6">
        <h1>Search Profiles</h1>
        <p class="text-base-content/60">Use natural language to query across all profile data</p>
      </div>

      <div class="card bg-base-100 shadow-sm mb-6">
        <div class="card-body">
          <form id="search-form">
            <div class="join w-full">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                class="input input-bordered join-item flex-1"
                id="search-input"
                value="${input.replace(/"/g, "&quot;")}"
              />
              <button type="submit" class="btn btn-primary join-item" ${isLoading ? "disabled" : ""}>
                <i data-lucide="search" style="width:18px;height:18px"></i>
                Search
              </button>
            </div>
          </form>
          ${
            !query
              ? `<div class="flex flex-wrap gap-2 mt-3" id="examples-bar">
            <span class="text-xs text-base-content/40 flex items-center gap-1">
              <i data-lucide="sparkles" style="width:12px;height:12px"></i> Try:
            </span>
            ${examplesHtml}
          </div>`
              : ""
          }
        </div>
      </div>

      <div id="results-area">${resultsHtml}</div>
    </div>`;

  lucide.createIcons();
  wireEvents();
}

function wireEvents() {
  document.getElementById("search-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("search-input").value.trim();
    if (!val) return;
    input = val;
    query = val;
    page = 1;
    doSearch();
  });

  document.getElementById("search-input")?.addEventListener("input", (e) => {
    input = e.target.value;
  });

  document.querySelectorAll("[data-example]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input = btn.dataset.example;
      query = btn.dataset.example;
      page = 1;
      doSearch();
    });
  });

  document.getElementById("sort-by-select")?.addEventListener("change", (e) => {
    sortBy = e.target.value;
    page = 1;
    doSearch();
  });
  document.getElementById("order-select")?.addEventListener("change", (e) => {
    order = e.target.value;
    page = 1;
    doSearch();
  });
  document.getElementById("limit-select")?.addEventListener("change", (e) => {
    limit = Number(e.target.value);
    page = 1;
    doSearch();
  });

  document.getElementById("pagination-bar")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled) return;
    page = Number(btn.dataset.page);
    doSearch();
  });
}

init();
