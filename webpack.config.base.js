var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        './examples/src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'examples/build'),
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                include: [
                  path.resolve(__dirname, "src"),
                  path.resolve(__dirname, "examples/src"),
                  path.resolve(__dirname, "node_modules/redux/src")
                ]
            },
            {
                test: /\.less?$/,
                loader: "style!css!less"
            }
        ]
    }
};
