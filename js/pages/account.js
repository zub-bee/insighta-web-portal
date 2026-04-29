import { initAuth, getUser } from "../auth.js";
import { createLayout } from "../layout.js";
import { escapeHtml } from "../utils.js";

/* global lucide */

async function init() {
  const user = await initAuth();
  if (!user) return;

  const content = createLayout("account");

  const roleBadge =
    user.role === "admin"
      ? "badge-error"
      : user.role === "analyst"
        ? "badge-primary"
        : "";

  content.innerHTML = `
    <div>
      <div class="mb-8">
        <h1>Account</h1>
        <p class="text-base-content/60">Your profile details</p>
      </div>

      <div class="card bg-base-100 shadow-sm max-w-2xl">
        <div class="card-body">
          <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div class="avatar">
              <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="${user.avatar_url}" alt="${escapeHtml(user.username)}" />
              </div>
            </div>
            <div class="text-center sm:text-left">
              <h2 class="text-2xl">${escapeHtml(user.username)}</h2>
              <span class="badge ${roleBadge} mt-1 capitalize">${escapeHtml(user.role)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <i data-lucide="mail" style="width:18px;height:18px" class="text-base-content/50 shrink-0"></i>
              <div>
                <p class="text-xs text-base-content/50">Email</p>
                <p>${escapeHtml(user.email)}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <i data-lucide="user" style="width:18px;height:18px" class="text-base-content/50 shrink-0"></i>
              <div>
                <p class="text-xs text-base-content/50">Username</p>
                <p>${escapeHtml(user.username)}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <i data-lucide="shield" style="width:18px;height:18px" class="text-base-content/50 shrink-0"></i>
              <div>
                <p class="text-xs text-base-content/50">Role</p>
                <p class="capitalize">${escapeHtml(user.role)}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <i data-lucide="clock" style="width:18px;height:18px" class="text-base-content/50 shrink-0"></i>
              <div>
                <p class="text-xs text-base-content/50">Last Login</p>
                <p>${user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "N/A"}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-4.5 h-4.5 shrink-0 flex items-center justify-center">
                <span class="inline-block w-2.5 h-2.5 rounded-full ${user.is_active ? "bg-success" : "bg-error"}"></span>
              </div>
              <div>
                <p class="text-xs text-base-content/50">Status</p>
                <p>${user.is_active ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  lucide.createIcons();
}

init();
