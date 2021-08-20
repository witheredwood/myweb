import cloud from 'alipay-serverless-sdk';


Page({
  data: {
    qrCodeUrl: '',
    content: '严禁DEMO携带枪支',
    action: '',
    keywords: '',
  },
  onLoad() { },
  async detectContent() {
    my.showLoading({
      content: '文本内容检测中',
    });
    try {
      console.info("测试开始");
      console.info('开始调用接口')
      const res = await cloud.security.textRisk.detect(this.data.content);
      
      console.info(this.data.content);
    
      console.info('接口调用完成，结果如下')
      console.info(res);
      console.info(res.code);
      console.info(res.keywords);
      console.info(res.action);

      this.setData({
        action: res.action,
        keywords: res.keywords,
      });

    } catch (e) {
      my.showToast({
        content: e.message || '未知错误',
      });
    }
    my.hideLoading();
  },
});
