import serve from 'rollup-plugin-serve';
import config from './rollup.config.js';
import path from 'path';
import replace from 'rollup-plugin-replace';
const publick = ['dist', 'node_modules','test'].map(item=>{
    return path.resolve(__dirname,item)
});
let cfg = config[0];
console.log(cfg);
cfg.input = './test/index.js';
cfg.output = [{
    file: './dist/test.js',
    format: 'iife',
    paths:{
        // vue:'./../vue/dist/vue.esm.browser.js'
    }
}];
cfg.plugins.push(serve({
    contentBase: publick,
}));
// cfg.plugins.push(copy({
//     targets: [
//         './test/index.html'
//     ],
//     outputFolder: './dist'
// }))
cfg.plugins.push(replace({
    // 'process.env.NODE_ENV':JSON.stringify('production'),
    'process.env.NODE_ENV':JSON.stringify('dev')
}))
cfg.external = [
    'vue',
    '@zkey-webapp/modal'
];
// TODO: 临时测试专用
// cfg.external.push('element-ui');
// cfg.output.globals = {
//     vue: 'vue/dist/vue.esm.browser.js'
// }
export default cfg;