const {sassPlugin} =require('esbuild-sass-plugin');
const esbuild=require('esbuild');
esbuild.serve({
    port:8000,
    servedir:'dist'
},{
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify:true,
    sourcemap:true,
    plugins:[sassPlugin()]
}).catch(() => process.exit(1))