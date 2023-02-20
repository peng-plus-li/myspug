// config-overrides.js
// 去除antd多种主题。
const { override, fixBabelImports, addWebpackAlias, addLessLoader, adjustStyleLoaders, addDecoratorsLegacy } = require('customize-cra');
const path = require('path')
module.exports = override(
    // 装饰器
    addDecoratorsLegacy(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
    }),
    // 增加别名。避免 ../../ 相对路劲引入 libs/http
    addWebpackAlias({
        '@': path.resolve(__dirname, './src')
    }),
    // 解决
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            localIdentName: '[local]--[hash:base64:5]'
        }
    }),
    // 网友`阖湖丶`的介绍，解决：ValidationError: Invalid options object. PostCSS Loader has been initialized...
    adjustStyleLoaders(({ use: [, , postcss] }) => {
        const postcssOptions = postcss.options;
        postcss.options = { postcssOptions };
    }),
);