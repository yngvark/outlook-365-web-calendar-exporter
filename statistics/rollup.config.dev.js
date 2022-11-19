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
        typescript(),
    ],

    output: {
        file: './dist/main.js',
    }


};