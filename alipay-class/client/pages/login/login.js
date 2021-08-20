
Page({
  data: {
  },

  onLoad() {},

  // 获取支付宝会员的基础信息
  onGetAuthorize(res) {
    console.log("开始获取会员信息了-----");
    my.getOpenUserInfo({ 
      fail: () => {
        my.alert("授权失败！");
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        console.log("userInfo", userInfo);

        let pages = getCurrentPages();//获取页面栈
        let prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去，并渲染出来
        prevPage.setData({
          nickName: userInfo.nickName,
          avatar: userInfo.avatar,
        })
        // 登录之后返回到"我的"页面
        my.navigateBack();
      },
    });
  }


});
