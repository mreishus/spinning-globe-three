import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/hosting-spin-globe.js',
  treeshake: true,
  output: {
    file: 'dist/hosting-spin-globe-bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    terser()
  ]
};

