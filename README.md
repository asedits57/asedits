# ABISHEK.M / AS_Edits Portfolio

Static portfolio site for `asedits57`, built for ABISHEK.M under the professional name `AS_Edits`.

## Files

- `index.html` contains the content structure.
- `styles.css` handles the visual system and responsive layout.
- `app.js` fetches public GitHub profile and repository data at runtime.

## How it works

Open `index.html` in a browser. The projects section will try to load public repositories from:

- `https://api.github.com/users/asedits57`
- `https://api.github.com/users/asedits57/repos?sort=updated&per_page=100`

If GitHub blocks the request or the browser is rate-limited, the page falls back to a profile-first GitHub card.
