import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjsPlugin from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
// PostCSS plugins 
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import csspreset from 'postcss-preset-env';
import cssnano from 'cssnano';
import vuePlugin from 'rollup-plugin-vue';
import replace from 'rollup-plugin-replace';
import {terser} from 'rollup-plugin-terser';
/**
 * 
 * @param {Object} param0
 * @param {String} param0.format 五种输出格式：amd /  es6 / iife / umd / cjs 
 * @param {String} param0.target js 代码版本  esnext es5 es2015
 * @param {Boolean} param0.compress 是否压缩
 * 
 */
function createConfig({format = 'esm',target = 'esnext',compress = false,extractCSS=true }) {
    let minTag = compress?'.min':'';
    let output = [];
    if (format == 'esm') {
        if (compress) throw Error('ES6模块不能压缩');
        output.push({
            file: `./dist/index.esm${minTag}.js`,
            format:'esm',
            sourcemap: false,
            paths: {}
        });
    }else{
        output.push({
            name: "ZKeyWebappLayer",
            file: `./dist/index${minTag}.js`,
            format: 'iife',
            sourcemap: false,
            paths: {}
        });
    }
    return {
        input: './src/index.ts',
        treeshake: true,
        output,
        plugins: [
            typescript({
                // tsconfig: false,
                // experimentalDecorators: true,
                lib: ["es5", "es6", "dom", "es7", "es2015.promise"],
                target,
                allowJs: true,
                importHelpers: true,
                removeComments:true
            }),
            vuePlugin({
                css: false,
                defaultLang:{ script: 'ts' },
                // template: { 
                //     optimizeSSR: true,
                //     // transpileOptions:{
                //     //     target: { chrome: 48, firefox: 44 }
                //     // }
                // } 
            }),
            commonjsPlugin({ extensions: ['.js'] }),
            resolve({ extensions: ['.mjs', '.js', '.jsx', '.json', '.ts','.vue'] }),
            postcss({
                name:'index.css',
                include: ['node_modules/**','libs/**','src/**', 'test/**'],
                extract:extractCSS,
                plugins: [
                    simplevars(),
                    nested(),
                    csspreset({
                        warnForDuplicates: false
                    }),
                    compress&&cssnano()
                ]
            }),
            // postcss({
            //     name:'libs.css',
            //     include: ['libs/**', 'node_modules/**'],
            //     plugins: [
            //         extractCSS&&cssnano()
            //     ],
            //     extract: extractCSS
            // }),
            compress&&terser({
                compress: {
                  pure_getters: true,
                  unsafe: true,
                  unsafe_comps: true,
                  warnings: false
                }
            })
        ],
        watch: {
            exclude: 'node_modules/**'
        },
        external: [
            'vue',
            'vue-router',
            'vuex',
            // 'tslib'
        ]
    };
}

export default [
    createConfig({ format: 'esm', target: 'esnext',compress: false, extractCSS: true }),
    createConfig({ format: 'iife', target: 'es5', extractCSS: false }),
    createConfig({ format: 'iife', target: 'es5', compress: true, extractCSS: false })
]
