import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('.stitch/dashboard_raw.html');
const cssPath = path.resolve('src/app/globals.css');
const outPath = path.resolve('.stitch/dashboard.html');

let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// Inject Tailwind script and custom CSS into the head
const headInjection = `
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${css}
  </style>
`;

if (html.includes('<head>')) {
  html = html.replace('<head>', `<head>${headInjection}`);
} else {
  html = `${headInjection}${html}`;
}

// Next.js uses <template> tags for suspense/streaming, which Stitch might not render correctly. We can leave it as is, or clean it up.
// Let's add a wrapper to simulate dark mode if it relies on data-theme
html = html.replace('<html', '<html data-theme="dark"');

fs.writeFileSync(outPath, html);
console.log('Successfully injected CSS into dashboard.html');
