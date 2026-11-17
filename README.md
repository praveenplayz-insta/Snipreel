# Snipreel

Free, in-browser AI clip maker. Drop a long video and get 5 vertical clips with
word-by-word captions, speaker-centered framing and color grading.
Everything runs in the visitor's browser, so hosting costs nothing.

## Files
- `index.html` page markup
- `style.css` all styling
- `app.js` transcription, clip picking, face tracking, caption themes, rendering
- `netlify.toml` Netlify settings (static site, no build step)

## Deploy: GitHub then Netlify
1. Create a new GitHub repository and upload these files to the root.
2. In Netlify choose **Add new site, Import an existing project**, then pick the repo.
3. Leave the build command empty and set the publish directory to `.`
4. Deploy. Netlify redeploys on every push to GitHub.

## Add a caption theme
Open `app.js`, find the `TH` object and add one line, for example:
`gold:{up:1,on:'#ffd23f',off:'#fff',glow:'#ff9a1f'}`
Then add `['gold','Gold']` to the caption chips list. Options per theme:
`up` uppercase, `on` and `off` colors, `glow`, `box` highlight color, `hard` hard shadow, `bar` background bar, `font`.

## Notes
- Best in desktop Chrome or Edge. Clips render in real time, so keep the tab open.
- First run downloads about 40 MB of AI models; the browser caches them.
- Models load from jsDelivr, Hugging Face and Google storage, so visitors need internet access.
