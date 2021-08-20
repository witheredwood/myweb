import cloud from 'alipay-serverless-sdk';

Page({

  onLoad() {

    this.setData({
    });
  },

  data: {
    certify_id: '',
    passed: '',
  },

  async cetifyInit() {
    var certifyParams = new Object({
      identityType: 'CERT_INFO',
      certType: 'IDENTITY_CARD',
      // 填写真实的证件名，如 小明
      certName: '',
      // 填写真实的证件号
      certNo: ''
    });

    var merchantConfig = new Object({
      returnUrl: 'www.taobao.com',
    });
    const res = await cloud.member.identification.init("piwei" + new Date().getTime(), 'FACE', certifyParams, merchantConfig);
    console.info('接口调用完成：' + res.code);
    console.info('接口调用完成：' + res.certifyId);
    this.setData({
      certify_id: res.certifyId
    })
  },

  async cetify() {

    
    const res = await cloud.member.identification.certify(this.data.certify_id);
    console.log(res);
    var params = {
      certifyId: this.data.certify_id,
      url: res.body,
    };

    my.call('startBizService', {
      name: 'open-certify',
      param: JSON.stringify(params),
    }, function (verifyResult) {
      // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
      console.log("认证结果" + verifyResult.resultStatus);
      if (verifyResult.resultStatus === '9000') {
        // 验证成功，接入方在此处处理后续的业务逻辑
        // ...
         my.showToast({
           content: "认证成功",
           type: 'success'
           });
        return;
      }

      // 用户主动取消认证
      if (verifyResult.resultStatus === '6001') {
        my.showToast({
          content: "已经取消认证",
          type: 'fail'});
        return;
      }

      const errorCode = verifyResult.result && verifyResult.result.errorCode;
       my.showToast({
          content: "认证失败: " + errorCode,
          type: 'fail'
          });
      // 其他结果状态码判断和处理 ...
    });

  },

  async cetifyQuery() {
    const res = await cloud.member.identification.query(this.data.certify_id);
    console.info('接口调用完成：' + res.code);
    console.info('接口调用完成：' + res.identityInfo);
    console.info('接口调用完成：' + res.materialInfo);
    console.info('接口调用完成：' + res.passed);
    this.setData({
      passed: res.passed
    });
  },

  startAPVerify(options, callback) {
    my.call('startBizService', {
      name: 'open-certify',
      param: JSON.stringify(options),
    }, callback);
  }
})