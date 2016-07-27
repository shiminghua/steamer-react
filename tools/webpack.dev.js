'use strict';

const path = require('path'),
      utils = require('./utils'),
      webpack = require('webpack');

var config = require('./config'),
    nodeModulesPath = path.join(__dirname, 'node_modules');

var HtmlResWebpackPlugin = require('html-res-webpack-plugin');

var configWebpack = config.webpack;

/**
 * [devConfig config for development mode]
 * @type {Object}
 */
var devConfig = {
    entry: {
        'js/index': [path.join(configWebpack.path.src, "/page/index/main.js")],
        'js/spa': [path.join(configWebpack.path.src, "/page/spa/main.js")],
    },
    output: {
        publicPath: configWebpack.defaultPath,
        path: path.join(configWebpack.path.dev),
        filename: "[name]" + configWebpack.chunkhash + ".js",
        chunkFilename: "chunk/[name]" + configWebpack.chunkhash + ".js",
    },
    module: {
        loaders: [
            { 
                test: /\.js?$/,
                loaders: ['react-hot'],
                exclude: /node_modules/,
            },
            { 
                test: /\.js?$/,
                loader: 'babel',
                query: {
                    cacheDirectory: '/webpack_cache/',
                    plugins: ['transform-decorators-legacy'],
                    presets: [
                        'es2015-loose', 
                        'react',
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader",
                include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url-loader?limit=1000&name=img/[name]" + configWebpack.hash + ".[ext]",
                ],
                include: path.resolve(configWebpack.path.src)
            },
            {
                test: /\.ico$/,
                loader: "url-loader?name=[name].[ext]",
                include: path.resolve(configWebpack.path.src)
            },
        ],
        noParse: [
            
        ]
    },
    resolve: {
        moduledirectories:['node_modules', configWebpack.path.src],
        extensions: ["", ".js", ".jsx", ".es6", "css", "scss", "png", "jpg", "jpeg", "ico"],
        alias: {
            'redux': 'redux/dist/redux',
            'react-redux': 'react-redux/dist/react-redux',
            'utils': path.join(configWebpack.path.src, '/js/common/utils'),
            'spin': path.join(configWebpack.path.src, '/js/common/spin'),
            'spinner': path.join(configWebpack.path.src, '/page/common/components/spinner/'),
            'report': path.join(configWebpack.path.src, '/js/common/report'),
            'touch': path.join(configWebpack.path.src, '/page/common/components/touch/'),
            'scroll':path.join(configWebpack.path.src, '/page/common/components/scroll/'),
            'pure-render-decorator': path.join(configWebpack.path.src, '/js/common/pure-render-decorator'),
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    watch: true, //  watch mode
    // devtool: "#inline-source-map",
};

devConfig.addPlugins = function(plugin, opt) {
    devConfig.plugins.push(new plugin(opt));
};

configWebpack.html.forEach(function(page) {
    devConfig.addPlugins(HtmlResWebpackPlugin, {
        filename: page + ".html",
        template: "src/" + page + ".html",
        favicon: "src/favicon.ico",
        chunks: configWebpack.htmlres.dev[page],
        htmlMinify: null
    });
}); 

module.exports = devConfig;