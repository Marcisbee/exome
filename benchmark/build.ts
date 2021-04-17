import { build } from 'esbuild'

build({
  entryPoints: [
    './react/counter',
  ],
  outdir: 'dist/react',
  target: 'es2016',
  format: 'esm',
  platform: 'browser',
  minify: true,
  bundle: true,
  sourcemap: 'external',
  logLevel: 'info'
}).catch(() => process.exit(1))
