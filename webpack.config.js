var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const theme = require("./package.json").theme;
const path = require("path");

module.exports = {
    entry: ["./src/index.tsx"],
    output: {
        filename: "./build/app.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Chat",
            filename: "./index.html",
            template: "./template/index-temp.html"
        })
    ],
    resolve: {
        // 引入文件可以省略后缀
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.web.js', '.json'],
        alias: {
            "react": path.resolve(__dirname, 'src/React.ts'),
            // "react-dom": "./src/ReactDOM.ts"
        }
    }
}