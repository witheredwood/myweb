module.exports = {
    // 设置网站title
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'vue各功能活插件示例'
            return args
        });
    },
    // 开发服务器相关配置。
    devServer: {
        proxy: {
            '/smart':{
                target:'http://172.16.2.195:8003',
                changeOrigin: true,
                // pathRewrite:{
                //     '^/smart': '/smart'
                // }
            },
            '/smartnews':{
                target:'http://172.16.2.195:8003',
                changeOrigin: true,
                // pathRewrite:{   // 重写路径
                //     '^/smartnews': '/smartnews'
                // }
            }
        }
    },

}
