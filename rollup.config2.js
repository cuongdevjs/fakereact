import typescript from "rollup-plugin-typescript2"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

export default {
    input: "./src/ReactDOM.ts",
    output: {
        file: "umd/react-dom.js",
        format: "umd",
        name: "ReactDOM",
        exports: "named",
    },
    plugins: [typescript(), resolve(), commonjs()]
}