# Md Shala Uddin Yousuf — Portfolio

A responsive, static portfolio for GitHub Pages. It uses plain HTML, CSS, and JavaScript; no build step or package installation is needed.

## Files

- `index.html` — page content and metadata
- `style.css` — layout, responsive styling, and light/dark themes
- `script.js` — theme control, mobile navigation, reveal effects, and current year
- `favicon.svg` — browser tab icon
- `Md_Shala_Uddin_Yousuf_Resume.pdf` — résumé linked from the page
- `.nojekyll` — keeps GitHub Pages from running Jekyll processing

## Preview locally

Open `index.html` directly in a browser, or start a small local server from this folder:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish to the existing GitHub Pages site

Copy these files to the root of the `rafi-402.github.io` repository, commit them to the publishing branch, and push the commit. GitHub Pages will publish the update at the repository's existing site URL. Keep the résumé PDF beside `index.html` so its download link continues to work.
