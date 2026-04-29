import { logout, getUser } from "./auth.js";
import { showToast } from "./toast.js";

/* global lucide */

const THEMES = ["light", "dark", "cupcake", "business", "cyberpunk", "forest"];

let currentTheme = localStorage.getItem("insighta_theme") || "light";

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("insighta_theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

function toggleTheme() {
  const idx = THEMES.indexOf(currentTheme);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
  showToast(`Theme: ${next}`, "info");
  updateThemeIcons();
}

function updateThemeIcons() {
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.setAttribute("data-lucide", currentTheme === "light" ? "moon" : "sun");
  });
  lucide.createIcons();
}

const NAV_ITEMS = [
  {
    href: "dashboard.html",
    key: "dashboard",
    label: "Dashboard",
    icon: "layout-dashboard",
  },
  { href: "profiles.html", key: "profiles", label: "Profiles", icon: "users" },
  { href: "search.html", key: "search", label: "Search", icon: "search" },
  { href: "account.html", key: "account", label: "Account", icon: "user" },
];

/**
 * Build the full drawer-layout shell and inject it into #app.
 * Returns the <div id="page-content"> element for the page script to populate.
 */
export function createLayout(activePage) {
  const user = getUser();
  applyTheme(currentTheme);

  const themeIcon = currentTheme === "light" ? "moon" : "sun";

  const navHtml = NAV_ITEMS.map(
    (item) => `
    <li class="w-full">
      <a href="${item.href}" class="${activePage === item.key ? "active" : ""}">
        <i data-lucide="${item.icon}" style="width:20px;height:20px"></i>
        ${item.label}
      </a>
    </li>`,
  ).join("");

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="drawer lg:drawer-open min-h-screen">
      <input id="main-drawer" title="Main Drawer" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col">
        <!-- Mobile navbar -->
        <div class="navbar bg-base-100 lg:hidden border-b border-base-300">
          <div class="flex-none">
            <label for="main-drawer" class="btn btn-square btn-ghost">
              <i data-lucide="menu" style="width:20px;height:20px"></i>
            </label>
          </div>
          <div class="flex-1">
            <span class="text-xl">Insighta Labs+</span>
          </div>
          <div class="flex-none">
            <button id="mobile-theme-toggle" class="btn btn-circle btn-ghost">
              <i data-lucide="${themeIcon}" data-theme-icon style="width:20px;height:20px"></i>
            </button>
          </div>
        </div>

        <main class="flex-1 p-6 lg:p-8 bg-base-200">
          <div class="max-w-7xl mx-auto" id="page-content"></div>
        </main>
      </div>

      <div class="drawer-side">
        <label for="main-drawer" class="drawer-overlay"></label>
        <aside class="bg-base-100 w-64 min-h-full flex flex-col border-r border-base-300">
          <div class="p-6 border-b border-base-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i data-lucide="search" style="width:22px;height:22px" class="text-primary-content"></i>
              </div>
              <div>
                <h2 class="text-lg">Insighta Labs+</h2>
                <p class="text-xs text-base-content/60">Profile Intelligence</p>
              </div>
            </div>
          </div>

          <nav class="flex-1 p-4">
            <ul class="menu gap-2">
              ${navHtml}
            </ul>
          </nav>

          <div class="p-4 border-t border-base-300">
            <div class="dropdown dropdown-top w-full">
              <div tabindex="0" class="btn btn-ghost w-full justify-start gap-3 h-auto py-2">
                <div class="avatar">
                  <div class="w-10 rounded-full">
                    <img src="${user?.avatar_url || ""}" alt="${user?.username || ""}" />
                  </div>
                </div>
                <div class="flex-1 text-left">
                  <div class="text-sm">${user?.username || ""}</div>
                  <div class="text-xs text-base-content/60">${user?.role || ""}</div>
                </div>
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg border border-base-300 mb-2">
                <li>
                  <button id="sidebar-theme-toggle" class="gap-2">
                    <i data-lucide="${themeIcon}" data-theme-icon style="width:16px;height:16px"></i>
                    Toggle Theme
                  </button>
                </li>
                <li>
                  <button id="logout-btn" class="gap-2 text-error">
                    <i data-lucide="log-out" style="width:16px;height:16px"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>`;

  // Wire event listeners
  document
    .getElementById("mobile-theme-toggle")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("sidebar-theme-toggle")
    .addEventListener("click", toggleTheme);
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logout();
  });

  lucide.createIcons();

  return document.getElementById("page-content");
}
