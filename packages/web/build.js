const {sassPlugin} =require('esbuild-sass-plugin');
require('esbuild').build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify:true,
    plugins:[sassPlugin()]
}).catch(() => process.exit(1))