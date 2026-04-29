import { escapeHtml, getInitials } from "./utils.js";

/* global lucide */

/**
 * Render the reusable profiles <table>.
 * Returns an HTML string (caller inserts it into the DOM).
 */
export function renderProfilesTable(
  profiles,
  { isLoading = false, skeletonRows = 10 } = {},
) {
  let bodyHtml = "";

  if (isLoading) {
    for (let i = 0; i < skeletonRows; i++) {
      bodyHtml += `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <div class="skeleton w-10 h-10 rounded-full shrink-0"></div>
              <div class="skeleton h-4 w-28"></div>
            </div>
          </td>
          <td><div class="skeleton h-4 w-14"></div></td>
          <td><div class="skeleton h-4 w-8"></div></td>
          <td><div class="skeleton h-5 w-16 rounded-full"></div></td>
          <td><div class="skeleton h-4 w-20"></div></td>
          <td><div class="skeleton h-4 w-20"></div></td>
          <td><div class="skeleton h-8 w-14 rounded"></div></td>
        </tr>`;
    }
  } else {
    for (const p of profiles) {
      bodyHtml += `
        <tr class="hover">
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar placeholder">
                <div class="flex justify-center items-center bg-neutral text-neutral-content rounded-full w-10">
                  <span class="text-xs">${escapeHtml(getInitials(p.name))}</span>
                </div>
              </div>
              <span>${escapeHtml(p.name)}</span>
            </div>
          </td>
          <td class="capitalize">${escapeHtml(p.gender)}</td>
          <td>${p.age}</td>
          <td>
            <span class="badge badge-outline capitalize">${escapeHtml(p.age_group)}</span>
          </td>
          <td>${escapeHtml(p.country_name)}</td>
          <td class="text-base-content/60 text-sm">
            ${new Date(p.created_at).toLocaleDateString()}
          </td>
          <td>
            <a href="profile-detail.html?id=${encodeURIComponent(p.id)}" class="btn btn-ghost btn-sm">
              View
            </a>
          </td>
        </tr>`;
    }
  }

  return `
    <div class="card bg-base-100 shadow-sm">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Age Group</th>
              <th>Country</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
    </div>`;
}

/**
 * Render a sliding-window pagination bar.
 * Returns an HTML string.
 */
export function renderPagination(page, totalPages, total, limit) {
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  if (start + windowSize - 1 > totalPages)
    start = Math.max(1, totalPages - windowSize + 1);
  const pages = Array.from(
    { length: Math.min(windowSize, totalPages) },
    (_, i) => start + i,
  );

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  let buttonsHtml = `
    <button
      aria-label="Previous page"
      class="join-item btn btn-sm"
      data-page="${Math.max(1, page - 1)}"
      ${page === 1 ? "disabled" : ""}
    >
      <i data-lucide="chevron-left" style="width:16px;height:16px"></i>
    </button>`;

  for (const p of pages) {
    buttonsHtml += `
      <button
        class="join-item btn btn-sm ${page === p ? "btn-active" : ""}"
        data-page="${p}"
      >${p}</button>`;
  }

  buttonsHtml += `
    <button
      aria-label="Next page"
      class="join-item btn btn-sm"
      data-page="${Math.min(totalPages, page + 1)}"
      ${page === totalPages ? "disabled" : ""}
    >
      <i data-lucide="chevron-right" style="width:16px;height:16px"></i>
    </button>`;

  return `
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-base-content/60">
        Showing ${from}\u2013${to} of ${total}
      </div>
      <div class="join" id="pagination-bar">
        ${buttonsHtml}
      </div>
    </div>`;
}

/**
 * Render skeleton pagination placeholder.
 */
export function renderPaginationSkeleton() {
  let dots = "";
  for (let i = 0; i < 5; i++) {
    dots += '<div class="skeleton h-8 w-8 rounded"></div>';
  }
  return `
    <div class="flex items-center justify-between mt-6">
      <div class="skeleton h-4 w-40"></div>
      <div class="flex gap-1">${dots}</div>
    </div>`;
}
