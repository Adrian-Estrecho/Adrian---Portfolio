# Adrian Estrecho portfolio

A React and Vite site with an interactive editing timeline for client work and case studies for web projects.

## Run it

```bash
npm install
npm run dev
```

## Edit your content

Almost everything lives in [src/content.js](src/content.js):

| To change | Edit |
| --- | --- |
| Name, bio, phone, email, photo, social links | `profile` |
| Client names, years, and timeline tracks | `clients` and `tracks` |
| An editing sample in the monitor | `sample` on a client (a YouTube link or `/samples/name.mp4`) |
| Project text, screenshots, and links | `projects` |
| Certificates | `certificates` |
| Resume summary, education, and job results | `resume` |

The hero is a playhead that wipes between a video editor side and a web developer side. Its text is `profile.sides` in `src/content.js`. The tile positions are in [src/components/Hero.jsx](src/components/Hero.jsx) and the tiles are in [src/components/Icons.jsx](src/components/Icons.jsx). The code portrait redraws itself from `profile.photo`, so a new photo needs no extra step.

Put images and videos in `public/`, then refer to them with a path that starts with `/`.

Notes and empty certificate slots marked "hidden on the live site" appear only under `npm run dev`.

## Update the resume

The resume at `/resume.html` fills in from `src/content.js`. After changing that file, run `npm run resume` on a computer with Chrome or Edge to save a new `public/Adrian-Estrecho-Resume.pdf`, then publish as usual.

## Publish it

```bash
npm run build
```

Upload the `dist` folder to any static host, or connect the project to Vercel or Netlify. Use `npm run build` as the build command and `dist` as the output folder.
