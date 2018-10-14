module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-pxtorem')({
            rootValue: 64,
            propList: ['*'],
            minPixelValue: 2,
        }),
    ]
}