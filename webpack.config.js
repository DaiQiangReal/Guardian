const HtmlWebpackPlugin = require("html-webpack-plugin");
const path=require('path');
const resolve=(filepath)=>{
return path.resolve(__dirname,filepath);
}
const isDev=()=>process.env.DEV === "develop";
module.exports = {
  mode: isDev()?"development":'production',
  entry: {
    index: "./src/index.js",
  },
  output: {
    // 打包文件根目录
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
    extensions:['.js','.jsx',',tsx','.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // jsx/js文件的正则
        include: resolve('src'),
        use: {
          // loader 是 babel
          loader: "babel-loader",
          // options: {
          //     // babel 转义的配置选项
          //     babelrc: false,
          //     presets: [
          //         // 添加 preset-react
          //         require.resolve('@babel/preset-react'),
          //         [require.resolve('@babel/preset-env'), {modules: false}]
          //     ],
          //     cacheDirectory: true
          // }
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          {
              loader:"css-loader",
              options:{
                  modules:{  
                    localIdentName: '[name]__[local]--[hash:base64:5]',  
                    exportGlobals: true,	// 注意！:global 声明全局样式需要该属性
                  },  
              }
          },
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  devtool: isDev()?"source-map":false,
  devServer: {
    contentBase: "./build",
    port:8000,
  },
};
