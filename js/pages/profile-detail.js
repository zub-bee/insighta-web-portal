import { initAuth } from "../auth.js";
import { createLayout } from "../layout.js";
import { api } from "../api.js";
import { escapeHtml, getInitials } from "../utils.js";

/* global lucide */

async function init() {
  const user = await initAuth();
  if (!user) return;

  const content = createLayout("profiles");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    content.innerHTML = `
      <div class="text-center py-12">
        <h2>Profile not found</h2>
        <a href="profiles.html" class="btn btn-primary mt-4">Back to Profiles</a>
      </div>`;
    return;
  }

  content.innerHTML = `
    <div class="flex items-center justify-center min-h-96">
      <span class="loading loading-spinner loading-lg"></span>
    </div>`;

  try {
    const profile = await api.getProfile(id);
    if (!profile) throw new Error("not found");
    render(content, profile);
  } catch {
    content.innerHTML = `
      <div class="text-center py-12">
        <h2>Profile not found</h2>
        <a href="profiles.html" class="btn btn-primary mt-4">Back to Profiles</a>
      </div>`;
  }
}

function render(content, profile) {
  content.innerHTML = `
    <div>
      <a href="profiles.html" class="btn btn-ghost btn-sm gap-2 mb-6">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i>
        Back to Profiles
      </a>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <div class="flex items-start gap-4">
                <div class="avatar placeholder">
                  <div class="flex justify-center items-center bg-neutral text-neutral-content rounded-full w-20">
                    <span class="text-2xl">${escapeHtml(getInitials(profile.name))}</span>
                  </div>
                </div>
                <div>
                  <h1 class="mb-2">${escapeHtml(profile.name)}</h1>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="badge badge-outline capitalize">${escapeHtml(profile.age_group)}</span>
                    <span class="badge badge-outline capitalize">${escapeHtml(profile.gender)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h2 class="card-title">Demographics</h2>
              <div class="space-y-3 mt-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-base-content/60">Age</span>
                  <span>${profile.age}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Gender</span>
                  <span class="capitalize">${escapeHtml(profile.gender)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Gender confidence</span>
                  <span>${(profile.gender_probability * 100).toFixed(0)}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Country</span>
                  <span>${escapeHtml(profile.country_name)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Country confidence</span>
                  <span>${(profile.country_probability * 100).toFixed(0)}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Added</span>
                  <span>${new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  lucide.createIcons();
}

init();
