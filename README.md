# The Armory — 365 things in a year

The hub for a year-long build: one static page indexing every project, the real
problem it solves, and its status. (Honest framing — a year of building, **not**
a literal "one project a day".)

Plain HTML/CSS/JS — no build step. GitHub Pages serves it as-is.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell |
| `style.css` | Styles |
| `app.js` | Renders cards from `projects.json`, search + filter |
| `projects.json` | **The data.** Append one entry per project. |

## Adding a project

Append an object to `projects.json` and push. The page updates itself.

```json
{
  "id": 2,
  "name": "Project name",
  "slug": "project-slug",
  "issue": "The real problem this addresses.",
  "solves": "How the finished thing relieves it.",
  "medium": "web",
  "tags": ["finance"],
  "track": "live",
  "status": "planned",
  "url": "",
  "repo": "",
  "download": "",
  "graduated": null,
  "phases": [
    { "title": "scaffold + data model", "done": false }
  ]
}
```

- `status` — `done` | `building` | `planned`. Drives the badge + the filter.
- `track` — lifecycle: `live` (hosted/static, shows **live**), `desktop`
  (GitHub Releases binary, shows **download**), `demo` (backend torn down after
  the showcase, shows **demo**). See the plan spec §5.
- `url` / `download` / `repo` — link target (live site / release / source). The
  card links to the first non-empty of `graduated.url → url → download → repo`.
- `graduated` — set to `{ "url": "..." }` when a project graduates into a
  standalone product; shows the **graduated** badge.
- `phases` — `[{ "title", "done" }]`. Progress = total `done` phases / 365 (the
  "365 things"). A card shows its phase checklist + `done/total`.

## Deploy (GitHub Pages)

1. Push this folder as its own repo (e.g. `armory`).
2. Repo → Settings → Pages → Source: `main` branch, `/ (root)`.
3. Live at `https://<user>.github.io/armory/`.

## Local preview

```bash
python -m http.server 8000   # then open http://localhost:8000
```

(`fetch("projects.json")` needs a server — opening the file directly won't load it.)
