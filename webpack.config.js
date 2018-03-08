const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const OUT_DIRECTORY = '/dist';

module.exports = {
    entry: {
        popup: './src/popup.ts',
        options: './src/options.ts',
        background: './src/background.ts'
    },
    output: {
        filename: '[name].min.js',
        path: __dirname + OUT_DIRECTORY
    },
    resolve: {
        // .js always needs to be resolved even though we do not have any JavaScript source files,
        // but we might have files that depend on JavaScript files from node_modules.
        extensions: ['.js', '.ts'],
        modules: ['node_modules', 'src']
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                include: /src/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true
                        }
                    }
                ]
            },
            // Send output `.js` files through source-map loader
            // (to reprocess source maps for debugging).
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre'
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: './src/popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            template: './src/options.html',
            chunks: ['options']
        }),
        new CopyWebpackPlugin([
            './manifest.json',
            './icon.png',
            './src/options.css',
            './src/popup.css'
        ]),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            watch: ['./src']
        })
    ]
};
