const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function buildStandalone() {
  console.log('Bundling game into standalone index.html...');

  const globalsPlugin = {
    name: 'globals',
    setup(build) {
      build.onResolve({ filter: /^(react|react-dom(\/client)?|react\/jsx-runtime|react\/jsx-dev-runtime|canvas-confetti)$/ }, args => ({
        path: args.path,
        namespace: 'global-external'
      }));
      build.onLoad({ filter: /.*/, namespace: 'global-external' }, args => {
        if (args.path === 'react') {
          return { contents: 'export default window.React; export const { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, forwardRef, memo, StrictMode, createElement } = window.React;' };
        }
        if (args.path === 'react-dom' || args.path === 'react-dom/client') {
          return { contents: 'export default window.ReactDOM; export const { createRoot, render } = window.ReactDOM;' };
        }
        if (args.path === 'react/jsx-runtime' || args.path === 'react/jsx-dev-runtime') {
          return { contents: `
            function createJsxElement(type, config, maybeKey) {
              var props = Object.assign({}, config);
              if (maybeKey !== undefined) {
                props.key = '' + maybeKey;
              }
              return window.React.createElement(type, props);
            }
            export const jsx = createJsxElement;
            export const jsxs = createJsxElement;
            export const jsxDEV = createJsxElement;
            export const Fragment = window.React.Fragment;
          ` };
        }
        if (args.path === 'canvas-confetti') {
          return { contents: 'export default (window.confetti || function() {});' };
        }
      });
    }
  };

  const result = await esbuild.build({
    entryPoints: [path.join(__dirname, '../src/main.tsx')],
    bundle: true,
    format: 'iife',
    plugins: [globalsPlugin],
    loader: { '.css': 'empty' },
    charset: 'utf8',
    write: false,
    minify: false, // Keep readable
  });

  const bundledJs = result.outputFiles[0].text;

  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>快乐冒险岛 (Happy Adventure Island)</title>
    <meta name="description" content="A vibrant Chinese language learning adventure RPG teaching 10 core words through interactive quests, dialogues, puzzles, and exploration." />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌴</text></svg>" />

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
          },
        },
      };
    </script>

    <!-- React 18 & ReactDOM 18 CDN -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- Babel Standalone CDN -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Canvas Confetti CDN -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

    <style>
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      .animate-pulse-glow {
        animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.3);
        border-radius: 9999px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.6);
      }
    </style>
  </head>
  <body class="bg-[#061c16] text-[#f8fafc] min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
    <div id="root"></div>

    <!-- Embedded Game Logic, Components, SVGs & Audio Synthesizer -->
    <script>
${bundledJs}
    </script>
  </body>
</html>
`;

  // Write to root index.html
  fs.writeFileSync(path.join(__dirname, '../index.html'), htmlContent, 'utf8');
  console.log('Successfully generated standalone root index.html!');

  // Also write to dist/index.html if dist exists
  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');
  console.log('Successfully updated dist/index.html!');
}

buildStandalone().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
