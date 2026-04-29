import { initAuth } from "../auth.js";
import { createLayout } from "../layout.js";
import { api } from "../api.js";
import { escapeHtml } from "../utils.js";

/* global lucide */

async function init() {
  const user = await initAuth();
  if (!user) return;

  const content = createLayout("dashboard");

  content.innerHTML = `
    <div class="flex items-center justify-center min-h-96">
      <span class="loading loading-spinner loading-lg"></span>
    </div>`;

  try {
    const stats = await api.getDashboardStats();
    render(content, stats);
  } catch {
    content.innerHTML =
      '<p class="text-error">Failed to load dashboard data.</p>';
  }
}

function render(content, stats) {
  // Gender breakdown
  let genderHtml = "";
  if (stats.gender_breakdown) {
    for (const [gender, count] of Object.entries(stats.gender_breakdown)) {
      const pct = stats.total_profiles
        ? Math.round((count / stats.total_profiles) * 100)
        : 0;
      const colorClass =
        gender === "male" ? "progress-primary" : "progress-secondary";
      genderHtml += `
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="capitalize">${escapeHtml(gender)}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <progress class="progress ${colorClass} w-full" value="${pct}" max="100"></progress>
        </div>`;
    }
  }

  // Age group breakdown
  let ageGroupHtml = "";
  if (stats.age_group_breakdown) {
    for (const [group, count] of Object.entries(stats.age_group_breakdown)) {
      const pct = stats.total_profiles
        ? Math.round((count / stats.total_profiles) * 100)
        : 0;
      ageGroupHtml += `
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="capitalize">${escapeHtml(group)}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <progress class="progress progress-info w-full" value="${pct}" max="100"></progress>
        </div>`;
    }
  }

  // Top countries
  let countriesHtml = "";
  if (stats.top_countries) {
    for (const c of stats.top_countries) {
      countriesHtml += `
        <tr>
          <td>${escapeHtml(c.country_name)}</td>
          <td class="uppercase text-base-content/60">${escapeHtml(c.country_id)}</td>
          <td class="text-right">${c.count}</td>
        </tr>`;
    }
  }

  // Recent profiles
  let recentHtml = "";
  if (stats.recent_profiles) {
    for (const p of stats.recent_profiles) {
      recentHtml += `
        <tr>
          <td>
            <a href="profile-detail.html?id=${encodeURIComponent(p.id)}" class="link link-hover link-primary">
              ${escapeHtml(p.name)}
            </a>
          </td>
          <td class="capitalize">${escapeHtml(p.gender)}</td>
          <td>${p.age}</td>
          <td class="uppercase">${escapeHtml(p.country_id)}</td>
          <td class="text-base-content/60">${new Date(p.created_at).toLocaleDateString()}</td>
        </tr>`;
    }
  }

  const avgAge = stats.averages?.age ?? "—";
  const avgGenderProb =
    stats.averages?.gender_probability != null
      ? `${(stats.averages.gender_probability * 100).toFixed(1)}%`
      : "—";
  const avgCountryProb =
    stats.averages?.country_probability != null
      ? `${(stats.averages.country_probability * 100).toFixed(1)}%`
      : "—";

  content.innerHTML = `
    <div>
      <div class="mb-8">
        <h1>Dashboard</h1>
        <p class="text-base-content/60">Overview of your profile intelligence system</p>
      </div>

      <div class="card bg-base-100 shadow-sm mb-6">
        <div class="card-body flex-row items-center gap-4">
          <div class="p-3 rounded-lg bg-primary/10">
            <i data-lucide="users" class="text-primary" style="width:24px;height:24px"></i>
          </div>
          <div>
            <p class="text-base-content/60 text-sm">Total Profiles</p>
            <p class="text-3xl">${stats.total_profiles ?? 0}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-base">
              <i data-lucide="bar-chart-3" style="width:18px;height:18px"></i> Gender Breakdown
            </h2>
            <div class="space-y-3 mt-2">${genderHtml}</div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-base">
              <i data-lucide="bar-chart-3" style="width:18px;height:18px"></i> Age Groups
            </h2>
            <div class="space-y-3 mt-2">${ageGroupHtml}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-base">
              <i data-lucide="globe" style="width:18px;height:18px"></i> Top Countries
            </h2>
            <div class="overflow-x-auto mt-2">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Code</th>
                    <th class="text-right">Profiles</th>
                  </tr>
                </thead>
                <tbody>${countriesHtml}</tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title text-base">
              <i data-lucide="calculator" style="width:18px;height:18px"></i> Averages
            </h2>
            <div class="grid grid-cols-1 gap-4 mt-2">
              <div class="stat bg-base-200 rounded-lg p-4">
                <div class="stat-title">Age</div>
                <div class="stat-value text-2xl">${avgAge}</div>
              </div>
              <div class="stat bg-base-200 rounded-lg p-4">
                <div class="stat-title">Gender Probability</div>
                <div class="stat-value text-2xl">${avgGenderProb}</div>
              </div>
              <div class="stat bg-base-200 rounded-lg p-4">
                <div class="stat-title">Country Probability</div>
                <div class="stat-value text-2xl">${avgCountryProb}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title text-base">Recent Profiles</h2>
          <div class="overflow-x-auto mt-2">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Country</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>${recentHtml}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;

  lucide.createIcons();
}

init();
