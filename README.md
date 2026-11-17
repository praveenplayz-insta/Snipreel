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

## Smart brain (optional, free)
Paste a free Gemini API key (aistudio.google.com) and optionally describe the video in "About this video".
The brain then writes a YouTube title and description, an Instagram caption, hashtags for both, and a spoken
intro that plays before each clip. The key is stored only in the visitor's browser. Only transcript text is sent to
Google. Without a key a simple built-in writer is used, and the intro voice needs either a key or the "About this video" note.
The intro voice runs in the browser: natural voice (Kokoro, about 90 MB) on desktop, a lighter voice on phones.

## Video quality
Choose Fast 540p or High 720p. Output is recorded in real time by the browser, so it cannot be better than the source footage.

## Add a caption theme
Open `app.js`, find the `TH` object and add one line, for example:
`gold:{up:1,on:'#ffd23f',off:'#fff',glow:'#ff9a1f'}`
Then add `['gold','Gold']` to the caption chips list. Options per theme:
`up` uppercase, `on` and `off` colors, `glow`, `box` highlight color, `hard` hard shadow, `bar` background bar, `font`.

## Notes
- Best in desktop Chrome or Edge. Clips render in real time, so keep the tab open.
- First run downloads about 40 MB of AI models; the browser caches them.
- Models load from jsDelivr, Hugging Face and Google storage, so visitors need internet access.
