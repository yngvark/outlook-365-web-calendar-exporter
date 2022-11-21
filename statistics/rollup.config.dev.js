// import commonjs from 'rollup-plugin-commonjs';
// import resolve from 'rollup-plugin-node-resolve';
// import replace from '@rollup/plugin-replace';
// import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: [
        './src/main.ts'
    ],

    plugins: [
        //  See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
        typescript({
            // I want to import dayjs, which of course is a nightmare in this god-damned module-hell
            // ecosystem:
            // https://github.com/ezolenko/rollup-plugin-typescript2/issues/258
            // https://www.npmjs.com/package/rollup-plugin-typescript2
            tsconfigOverride: {
                compilerOptions: {
                    module: 'es2020'
                }
            }
        }),
    ],

    output: {
        file: './dist/main.js',
    },
};