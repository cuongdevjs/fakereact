import typescript from "rollup-plugin-typescript2"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

export default {
    input: "./src/React.ts",
    output: {
        file: "umd/react.js",
        format: "umd",
        name: "React",
        exports: "named",
    },
    plugins: [typescript(), resolve(), commonjs()]
}