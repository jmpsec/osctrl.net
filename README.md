# osctrl.net

Marketing / informational website for [osctrl](https://github.com/jmpsec/osctrl),
served at [https://osctrl.net](https://osctrl.net). The technical documentation
lives separately at [https://docs.osctrl.net](https://docs.osctrl.net).

<p align="center">
  <img alt="osctrl by JMP Security" src="osctrl.png" width="300" />
  <p align="center">
    osctrl - Fast and efficient osquery management
  </p>
</p>

## Structure

Plain static HTML/CSS/JS — no build step, no dependencies.

- `index.html` — home: what osctrl is, features, components, quick start
- `use-cases.html` — use cases and benefits
- `technology.html` — architecture diagram, components, tech stack, security
- `getting-started.html` — Docker, provisioning script, build from source
- `resources.html` — docs, API, community and osquery ecosystem links
- `assets/` — styles, scripts, fonts and images

## Design

The look and feel mirrors the osctrl React frontend
(`osctrl/frontend/src/styles/tokens.css` and `base.css`):

- **Colors**: dark theme tokens (`--bg-0…3`, `--signal` teal `#2bc4be`, etc.)
- **Fonts**: Inter (body), Space Grotesk (headings), Bai Jamjuree
  (wordmark, self-hosted in `assets/fonts/`), IBM Plex Mono (code) —
  Inter/Space Grotesk/IBM Plex Mono load from Google Fonts
- **Background**: the frontend's circuit-trace pattern plus an animated
  particle-network canvas (`assets/site.js`); content sections reveal on
  scroll. Both respect `prefers-reduced-motion`.

## Local preview

### Using npx / Makefile

To see how the website will look like before submitting your changes, you can serve it locally. Using the `Makefile` issue the command `make serve` and the website will be generated and served locally using `npx http-server`. 

### Using python

You can launch a local webserver using python with the following command:

```bash
python3 -m http.server 8930
```

Then open http://localhost:8930.
