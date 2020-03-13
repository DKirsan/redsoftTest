const HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    glob = require("glob"),
    path = require('path');

module.exports = () => {
    const pluginsOptions = [
        new MiniCssExtractPlugin({
            filename: 'styles/main.bundle.css'
        }),
        new CopyWebpackPlugin([
            {
                from: './images',
                to: './images'
            }
        ])
    ];

    let pages = glob.sync(__dirname + '/source/templates/pages/*.pug');
    pages.forEach(function (file) {
        let base = path.basename(file, '.pug');
        pluginsOptions.push(
            new HtmlWebpackPlugin({
                filename: './' + base + '.html',
                template: './templates/pages/' + base + '.pug',
                inject: true
            })
        )
    });

    return {
        context: __dirname + '/source/',
        entry: {
            main: './scripts/main.js'
        },
        output: {
            filename: 'scripts/[name]'+'.bundle'+'.js',
            path: path.resolve(__dirname, './dist')
        },
        optimization: {
            //minimize: false
        },
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    use: {
                        loader: 'pug-loader',
                        query: {
                            pretty: true
                        }
                    }
                }, {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }, {
                    test: /\.(sass|scss|css)$/,
                    use:  [
                        { loader: 'style-loader' },
                        { loader: MiniCssExtractPlugin.loader },
                        { loader: 'css-loader' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('postcss-sort-media-queries')({
                                        //sort: 'desktop-first'
                                    }),
                                    require('cssnano')
                                ]
                            }
                        },
                        { loader: 'sass-loader' }
                    ]
                }, {
                    test: /\.(woff|woff2|ttf|otf|eot?)(\?.+)?$/,
                    loader: 'file-loader',
                    options:  {
                        name: '[name].[ext]',
                        publicPath: '../fonts/',
                        outputPath: 'fonts/',
                        limit: 10000
                    }
                }
            ]
        },
        plugins: pluginsOptions,
        devServer: {
            contentBase: path.resolve(__dirname, './dist'),
            port: 9005,
            compress: true,
            open: true,
            disableHostCheck: true,
            noInfo: true,
            stats: 'minimal'
        }
    };
};