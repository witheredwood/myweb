import { log } from './utils';
import MPServerless from '@alicloud/mpserverless-sdk';
import cloud from 'alipay-serverless-sdk';


my.serverless = my.serverless || new MPServerless({
  uploadFile: my.uploadFile,
  request: my.request,
  getAuthCode: my.getAuthCode,
}, {
  appId: '2021002171654034', // 小程序应用标识
  spaceId: '72bb5afd-fb6b-46c3-bf96-0fe148a28185', // 服务空间标识
  clientSecret: 'NIzU71BNWk8ukTHLAImCwA==', // 服务空间 secret key
  endpoint: 'https://api.bspapp.com', // 服务空间地址，从小程序 serverless 控制台处获得。这个是API endpoint
});

// 必须要初始化哦~cloud 是一个单例，初始化一次 App 引入均可生效
cloud.init(my.serverless);

App({
  async onLaunch(options) {
    log.info('App onLaunch');
    // 授权登录方法
    var res = await my.serverless.user.authorize({
      authProvider: 'alipay_openapi',
    });
    console.log('基础授权结果:' + res);
  },
  onShow(options) {
    log.info('App onShow');
  },
});
