# The Armory — Day 1 of 365

The hub for a 365-day build streak. One static page that indexes every project
and links out to the ones that are hosted on the web.

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
  "day": 2,
  "name": "Project name",
  "slug": "project-slug",
  "date": "2026-06-27",
  "description": "One or two sentences.",
  "url": "https://user.github.io/project-2-slug",
  "repo": "https://github.com/user/project-2-slug",
  "tags": ["web", "tool"],
  "hosted": true
}
```

- `url` — live site. Empty `""` if not hosted.
- `repo` — source. Optional.
- `hosted` — `true` only if there's a real `url`. Drives the "live" badge and the
  Hosted/Local filter. A card with no `url`/`repo` renders as plain text (no link).

## Deploy (GitHub Pages)

1. Push this folder as its own repo (e.g. `armory`).
2. Repo → Settings → Pages → Source: `main` branch, `/ (root)`.
3. Live at `https://<user>.github.io/armory/`.

## Local preview

```bash
python -m http.server 8000   # then open http://localhost:8000
```

(`fetch("projects.json")` needs a server — opening the file directly won't load it.)
