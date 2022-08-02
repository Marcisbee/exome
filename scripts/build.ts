import { build } from 'esbuild'

(['cjs', 'esm'] as const)
  .forEach((format) => {
    // Core
    build({
      entryPoints: [
        'src/index.ts'
      ],
      outfile: format === 'esm' ? 'dist/exome.esm.js' : 'dist/exome.js',
      target: 'es2016',
      format,
      platform: 'browser',
      minifyIdentifiers: true,
      minifySyntax: true,
      bundle: true,
      sourcemap: 'external',
      logLevel: 'info'
    }).catch(() => process.exit(1))

    // Utilities
    build({
      entryPoints: [
        'src/subscribe.ts',
        'src/react.ts',
        'src/preact.ts',
        'src/vue.ts',
        'src/lit.ts',
        'src/svelte.ts',
        'src/rxjs.ts',
        'src/devtools.ts'
      ],
      outdir: 'dist',
      entryNames: format === 'esm' ? '[dir]/[name].esm' : '[dir]/[name]',
      target: 'es2016',
      format,
      platform: 'browser',
      minifyIdentifiers: true,
      minifySyntax: true,
      bundle: true,
      sourcemap: 'external',
      external: [
        'react',
        'preact',
        'vue',
        'lit',
        'svelte',
        'rxjs',
        'exome'
      ],
      logLevel: 'info'
    }).catch(() => process.exit(1))
  })

// Extras
build({
  entryPoints: [
    'src/jest/serializer.ts'
  ],
  outfile: 'dist/jest/serializer.js',
  platform: 'node',
  format: 'cjs',
  target: 'node12',
  minify: true,
  logLevel: 'info'
}).catch(() => process.exit(1))
