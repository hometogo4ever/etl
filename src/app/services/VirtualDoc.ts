import * as vscode from "vscode";

export function openVirtualWebview(
  title: string,
  content: string,
  style?: string
) {
  const panel = vscode.window.createWebviewPanel(
    "virtualDocument", // internal ID
    title, // 탭 제목
    vscode.ViewColumn.One,
    {
      enableScripts: true, // JS 허용
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getWebviewHTML(title, content);
}

function getWebviewContent(title: string, body: string): string {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { color: #007acc; }
          code { background: #eee; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${body}</p>
      </body>
      </html>
    `;
}

function getWebviewHTML(title: string, html: string, style?: string) {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${style}</style>
        <title>${title}</title>
        </head>
        <body class="vscode-container">
        ${html}
        </body>
        </html>`;
}
