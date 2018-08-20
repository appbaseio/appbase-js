import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'appbase-js',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      nodeResolve({ preferBuiltins: false }), // or `true`
      commonjs(),
      builtins(),
    ],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    external: [
      'cross-fetch',
      'eventemitter2',
      'json-stable-stringify',
      'querystring',
      'stream',
      'url-parser-lite',
      'ws',
    ],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
];
