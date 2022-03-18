module.exports = {
    // baseUrl: './',
    // assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        disableHostCheck: true,
        proxy: {
            '/api':{
                target:'http://10.110.124.130:5000',
                changeOrigin:true,
                timeout: 600000000
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