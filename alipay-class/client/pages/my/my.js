
Page({
  data: {
    nickName: '登录',
    avatar: '/static/icon/tx.jpg',
  },
  onLoad() {
    // 如果用户已授权，直接显示用户昵称
     my.getOpenUserInfo({ 
      fail: () => {},
      success: (res) => {
        // 授权成功
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        console.log("userInfo", userInfo);
        if (userInfo.code == '10000') {  // 授权成功
          this.setData({
            nickName: userInfo.nickName,
            avatar: userInfo.avatar
          })
        }
      }
     });
  },

  onShow() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    this.setData({
      nickName: currPage.data.nickName,
      avatar: currPage.data.avatar,
    })

    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad();
    }

  },
  // 转向登录页面
  toLogin() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let name = currPage.data.nickName;
    console.log("my > nickName ==> ", name);
    if (name == '登录') {  // 用户未登录时点击才会跳转到登录页面
      my.navigateTo({
        url:"/pages/login/login",
      })
    }
  },
  
  // 分享功能
  onShare() {
    if (my.getLocation) {
      console.log("分享面板来了-------")
      my.showSharePanel();
      // my.getLocation();
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样提示
        my.alert({
          title: '提示',
          content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
        });
    }
  }


});
