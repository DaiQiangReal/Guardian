const HtmlWebpackPlugin = require("html-webpack-plugin");
const path=require('path');
const resolve=(filepath)=>{
    return path.resolve(__dirname,filepath);
}
const isDev=()=>process.env.DEV === "develop";
module.exports = {
    mode: isDev()?"development":'production',
    entry: {
        index: "./src/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
    },
    plugins: [
        // 生成 index.html
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/static/index.html",
        }),
    ],
    resolve:{
        alias:{
            pages:resolve('src/pages'),
            components:resolve('src/components')
        },
        extensions:['.js','.jsx','.ts','.tsx','.json']
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/, 
                include: resolve('src'),
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    'css-modules-typescript-loader',
                    {
                        loader:"css-loader",
                        options:{
                            sourceMap:isDev(),
                            modules:{
                                auto:true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',  
                                exportGlobals: true,
                            },  
                        }
                    },

                    "sass-loader",
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader:"css-loader",
                        options:{
                            modules:{
                                auto:true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',  
                                exportGlobals: true,
                            },  
                        }
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
        ],
    },
    devtool: isDev()?"source-map":false,
    devServer: {
        contentBase: "./build",
        port:8000,
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        },
        name: 'development-cache',
    },
};
    
