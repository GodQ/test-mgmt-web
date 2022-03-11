module.exports = {
    // baseUrl: './',
    // assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8081,
        disableHostCheck: true,
        proxy: {
            '/api':{
                target:'http://127.0.0.1:5000',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            },
            '/mock_servers':{
                target:'http://127.0.0.1:5000',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            }
        }
    }
}