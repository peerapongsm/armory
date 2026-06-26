const TOTAL_DAYS = 365;
const state = { projects: [], filter: "all", query: "" };

const $ = (sel) => document.querySelector(sel);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

async function load() {
  const res = await fetch("projects.json");
  state.projects = await res.json();
  render();
  paintProgress();
}

function paintProgress() {
  const done = state.projects.length;
  const pct = Math.round((done / TOTAL_DAYS) * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-count").textContent = `${done} / ${TOTAL_DAYS}`;
  $("#progress-pct").textContent = pct + "%";
  $("#footer-day").textContent = done;
}

function matches(p) {
  const isHosted = !!(p.hosted && p.url);
  if (state.filter === "hosted" && !isHosted) return false;
  if (state.filter === "local" && isHosted) return false;
  if (!state.query) return true;
  const hay = `${p.name} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase();
  return hay.includes(state.query);
}

function card(p) {
  const isHosted = !!(p.hosted && p.url);
  const linked = !!(p.url || p.repo);
  const href = encodeURI(p.url || p.repo || "");
  const tag = (t) => `<span class="tag">${esc(t)}</span>`;
  const el = document.createElement("li");
  el.innerHTML = `
    <a class="card ${linked ? "linked" : ""}" ${linked ? `href="${href}"` : ""} ${p.url ? 'target="_blank" rel="noopener"' : ""}>
      <span class="go">↗</span>
      <div class="card-top">
        <span class="day-tag">DAY ${Number(p.day)}</span>
        <span class="status ${isHosted ? "hosted" : ""}">${isHosted ? "live" : "local"}</span>
      </div>
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.description)}</p>
      <div class="tags">${(p.tags || []).map(tag).join("")}</div>
    </a>`;
  return el;
}

function render() {
  const grid = $("#grid");
  const visible = state.projects.filter(matches).sort((a, b) => b.day - a.day);
  grid.replaceChildren(...visible.map(card));
  $("#empty").hidden = visible.length > 0;
}

$("#search").addEventListener("input", (e) => {
  state.query = e.target.value.trim().toLowerCase();
  render();
});

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  state.filter = btn.dataset.filter;
  document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("active", b === btn));
  render();
});

load();
