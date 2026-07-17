/**
 * Docs controller - serves the API.md documentation as a rendered HTML page
 */

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

const API_MD_PATH = path.join(__dirname, '..', '..', 'API.md');

const getDocs = (req, res) => {
  fs.readFile(API_MD_PATH, 'utf8', (err, markdown) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Documentation file could not be loaded',
      });
    }

    const htmlContent = md.render(markdown);

    const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Documentation</title>
  <style>
    :root {
      --bg: #0f1115;
      --card: #171a21;
      --text: #e6e6e6;
      --muted: #9aa4b2;
      --accent: #4f9cf9;
      --code-bg: #0b0d12;
      --border: #262b36;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .wrap { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
    header { border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 24px; }
    h1 { font-size: 2rem; margin: 0 0 8px; color: #fff; }
    h2 { font-size: 1.5rem; margin-top: 40px; color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 6px; }
    h3 { font-size: 1.2rem; margin-top: 28px; color: #fff; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      background: var(--code-bg);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      font-size: 0.88em;
      color: #ffd479;
    }
    pre {
      background: var(--code-bg);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid var(--border);
    }
    pre code { background: none; padding: 0; color: #d6e1f0; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }
    th { background: var(--card); color: #fff; }
    blockquote { border-left: 4px solid var(--accent); margin: 16px 0; padding: 4px 16px; color: var(--muted); background: var(--card); border-radius: 0 8px 8px 0; }
    hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
    .toc { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 24px; }
    .toc ul { margin: 0; }
  </style>
</head>
<body>
  <div class="wrap">
    ${htmlContent}
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(page);
  });
};

module.exports = {
  getDocs,
};
