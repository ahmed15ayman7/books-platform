// Bundles React + ReactDOM (from web/node_modules) into vendor/react.bundle.js.
// Run:  node tools/build-vendor.mjs   (from mobile/doc/design/ui-design)
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(here, '../../../../../web');
const require = createRequire(path.join(webDir, 'package.json'));
const esbuild = require('esbuild');

await esbuild.build({
  stdin: {
    contents: `
      import * as React from 'react';
      import * as ReactDOMClient from 'react-dom/client';
      window.React = React;
      window.ReactDOM = ReactDOMClient;
    `,
    resolveDir: webDir,
  },
  bundle: true,
  format: 'iife',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: path.resolve(here, '../vendor/react.bundle.js'),
  legalComments: 'none',
});
console.log('built vendor/react.bundle.js');
