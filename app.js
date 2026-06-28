const TOTAL = 365;
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

const donePhases = (p) => (p.phases || []).filter((ph) => ph.done).length;

function paintProgress() {
  const done = state.projects.reduce((n, p) => n + donePhases(p), 0);
  const pct = Math.round((done / TOTAL) * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-count").textContent = `${done} / ${TOTAL}`;
  $("#progress-pct").textContent = pct + "%";
  $("#footer-count").textContent = done;
}

// badge: {cls, label} derived from status + track
function badge(p) {
  if (p.graduated) return { cls: "graduated", label: "graduated" };
  if (p.status === "planned") return { cls: "planned", label: "planned" };
  if (p.status === "building") return { cls: "building", label: "building" };
  if (p.track === "desktop") return { cls: "download", label: "download" };
  if (p.track === "demo") return { cls: "demo", label: "demo" };
  return { cls: "live", label: "live" };
}

function linkFor(p) {
  return (p.graduated && p.graduated.url) || p.url || p.download || p.repo || "";
}

function matches(p) {
  if (state.filter !== "all" && p.status !== state.filter) return false;
  if (!state.query) return true;
  const hay = `${p.name} ${p.issue} ${p.solves} ${(p.tags || []).join(" ")}`.toLowerCase();
  return hay.includes(state.query);
}

function card(p) {
  const b = badge(p);
  const href = encodeURI(linkFor(p));
  const linked = !!href;
  const external = !!(p.url || p.download || (p.graduated && p.graduated.url));
  const total = (p.phases || []).length;
  const done = donePhases(p);
  const phases =
    total > 0
      ? `<ul class="phases">${p.phases
          .map((ph) => `<li class="${ph.done ? "ok" : ""}">${esc(ph.title)}</li>`)
          .join("")}</ul>`
      : "";
  const tag = (t) => `<span class="tag">${esc(t)}</span>`;
  const el = document.createElement("li");
  el.innerHTML = `
    <a class="card ${linked ? "linked" : ""}" ${linked ? `href="${href}"` : ""} ${external ? 'target="_blank" rel="noopener"' : ""}>
      <span class="go">↗</span>
      <div class="card-top">
        <span class="id-tag">#${Number(p.id)}</span>
        <span class="status ${b.cls}">${b.label}</span>
      </div>
      <h2>${esc(p.name)}</h2>
      <p class="issue"><span>issue</span> ${esc(p.issue)}</p>
      <p class="solves"><span>solves</span> ${esc(p.solves)}</p>
      ${total > 0 ? `<div class="phase-meta">${done}/${total} phases</div>${phases}` : ""}
      <div class="tags">${(p.tags || []).map(tag).join("")}</div>
    </a>`;
  return el;
}

function render() {
  const grid = $("#grid");
  const visible = state.projects
    .filter(matches)
    .sort((a, b) => a.id - b.id);
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
