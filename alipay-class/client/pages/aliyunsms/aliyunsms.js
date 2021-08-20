import cloud from 'alipay-serverless-sdk';

Page({

  onLoad() {

    this.setData({
    });
  },

  data: {
    result: '',
    bizId: '',
  },

  async sendSms() {
    console.info("测试开始");
    console.info('开始调用接口')

    const res = await cloud.aliyun.shortMessage.send('15928032479', '签名云通信', 'SMS_183450981','{"code":"456"}');
    console.info(res);
    console.info('接口调用完成：' + res.message);
    console.info('接口调用完成：' + res.bizId);
    
    this.setData({
      result: '发送结果：' + res.message,
      bizId: res.bizIds
    });

  },

  async sendBatchSms() {
    const res = await cloud.aliyun.shortMessage.batchSend('[\"15928032479\",\"13678079943\"]', '["签名云通信","签名云通信"]', 'SMS_183450981', '[{"code":"135"},{"code":"246"}]');
    console.info(res);
    console.info('接口调用完成：' + res.message);
    console.info('接口调用完成：' + res.bizId);

    this.setData({
      result: '批量发送结果：' + res.message,
      bizId: res.bizId,
    });
  },

  async querySendDetails() {

    console.info("测试开始");
    console.info('开始调用接口')
  
    const res = await cloud.aliyun.shortMessage.query('13028139998', '20200221', 10, 1);
    console.log('范围查询结果：');
    console.log(res);
  },

  async querySendDetailsWithBizid() {
  
    console.info("测试开始");
    console.info('开始调用接口')
    const res = await cloud.aliyun.shortMessage.preciseQuery('13028139998', '20200221', 10, 1, this.data.bizId);
    console.log('精确查询结果：');
    console.log(res);
  }

})