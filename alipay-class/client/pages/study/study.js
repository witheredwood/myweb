
Page({
  data: {
    // ...myconfig,
    courseList: []
  },
  onLoad() {
  },
  onShow() {
    console.log("study > onShow --------")
    // 获取用户信息
    my.getOpenUserInfo({ 
      fail: () => {
        my.alert("授权失败！");
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        console.log("userInfo", userInfo);
        if (userInfo.code == '10000') {  // 授权成功
          console.log("我又获取到用户的信息了，哈哈哈哈哈");
          let name = userInfo.nickName;
          // 获取用户所有的学习课程
          my.serverless.db.collection('studyinfo').find({
            nickName: name,
          }).then((res) => {
              console.log(res.success);
              console.log(res.result);
              if (res.success && res.result) {   // 查询成功，并且有学习课程
                // console.log("查询成功");
                let data = res.result;  // 多个学习课程的数组
                let list = [];
                for (let i=0; i<data.length; i++) {
                    list.push(data[i]);
                }
                this.setData({
                  courseList: list
                });
              }
            }).catch(console.error);
        }
      }
     });
  },

  toDetail(event) {
    console.log("event ==> ", event);
    let title = event.target.dataset.arg;  // 获取点击事件的对象的参数
    // 跳转到该标题的课程详情页面
    my.navigateTo({
      url:"/pages/detail/detail?title=" + title,
    });
  }

});
