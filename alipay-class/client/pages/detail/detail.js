import { config } from './config';

Page({
  data: {
    ...config,
    courseinfo: {},
    activeTab: 0,
    isStudy: false,
    courseList: [],
  },

  onReady() {},
  onLoad(args) {
   console.log(args, 'args');
    // 接收上个页面传来的参数
    let title = args.title;
    console.log(title);

    // // 显示课程详情.先从缓存中查找课程信息,如果找不到课程信息,再从数据库中查找
    // my.getStorage({
    //   key: 'courseinfo',
    //   success: (res) => {
    //     if (res.data != null && res.data.courseinfo.length > 0) {  // 缓存中有课程信息
    //       let data = res.data.courseinfo;
    //       for (let i=0; i<data.length; i++) {
    //         if (title === data[i].title) {  // 查找到该课程详细信息
    //           this.setData({    // 渲染页面数据
    //             courseinfo: data[i]
    //           })
    //         }
    //       }
    //     } else {  // 缓存为空, 或者存放的课程为空.从数据库中查找该课程信息
    //       console.log("缓存为空");
    //       let list = [];
    //       my.serverless.db.collection('courseinfo').find()
    //       .then((res) => {
    //         console.log(res.success);
    //         console.log(res.result);
    //         if (res.success && res.result) {   // 如果函数返回成功，则赋值
    //           let data = res.result;
    //           for (let i=0; i<data.length; i++) {
    //               list.push(data[i]);
    //           }
    //         }
    //         // 渲染页面数据
    //         this.setData({courseinfo: list});
    //         // 设置缓存
    //         my.setStorage({
    //           key: "courseinfo",
    //           data: {
    //             courseinfo: list
    //           },
    //           success: function() {
    //             console.log("首页数据缓存成功");
    //           }
    //         });
    //       }).catch(console.error);
    //     } 
    //   },
    //   fail: () => {
    //     console.log("获取缓存失败")
    //   },
    // });

    // 在前端直接调用serverless的数据库函数，不需要自己写云函数
    my.serverless.db.collection('courseinfo').findOne({title: title})
    .then((res) => {
      console.log(res.success);
      console.log(res.result);
      
      if (res.success && res.result) {   // 如果函数返回成功，则赋值
        this.setData({
          courseinfo: res.result
        });
      }
    }).catch(console.error);

      // my.serverless.db.collection('studyinfo').find({

      // })
          // .then((res) => {
          //   console.log(res.success);
          //   console.log(res.result);
          //   if (res.success && res.result) {   // 如果函数返回成功，则赋值
          //     let data = res.result;
          //     for (let i=0; i<data.length; i++) {
          //         list.push(data[i]);
          //     }
          //   }
          // }).catch(console.error);


    // let data = this.courseList;
    // for (let i=0; i<data.length; i++) {
    //   if (title == data.title) {
    //     console.log("好吧，我知道你在学这个课程了")
    //     this.setData({isStudy: true});
    //   }
    // }

    // 判断用户是否已加入学习
    my.getOpenUserInfo({ 
      fail: () => {},
      success: (res) => {
        // 授权成功
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        console.log("userInfo", userInfo);
        if (userInfo.code == '10000') {  // 授权成功
          // 获取用户所有的学习课程
          my.serverless.db.collection('studyinfo').find({
            nickName: userInfo.nickName,
          }).then((res) => {
              console.log(res.success);
              console.log(res.result);
              if (res.success && res.result) {   // 查询成功，并且有学习课程
                let data = res.result;  // 多个学习课程的数组
                let list = [];
                for (let i=0; i<data.length; i++) {
                  list.push(data[i]);
                }
                this.setData({
                  isStudy: true
                })
              }
            }).catch(console.error);
        }
      }
     });
  },

  // 点击横线选项卡的tab
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
 // 切换横线选项卡的tab
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },


  // 添加学习课程，会跳转到该课程目录页面
  addToMy() {
    // 用户已加入该课程
    if (this.isStudy === true) {  
      my.alert({
        content: "加入失败，您已经在学习该课程哦"
      })
    }
    // 如果用户未加入该课程.有两种情况:一是用户未登录,二是用户登录了但没有选学该课程
     my.getOpenUserInfo({   // 判断用户是否已授权
      fail: () => {
        console.log("用户未授权,转向登录页面");
        my.navigateTo({
          url:"/pages/login/login",
        })
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        if (userInfo.code == '40003') {   // 未授权
            console.log("查询成功,用户未授权,转向登录页面");
            // 跳转到登录
            my.navigateTo({
              url:"/pages/login/login",
            });
        } else {
          console.log("加入学习了-----------");
          // 将用户加入到的课程信息写入数据库
          let pages = getCurrentPages();
          let currPage = pages[pages.length - 1]; //当前页面
          // 插入数据
          my.serverless.db.collection("studyinfo").insertOne({
              nickName: userInfo.nickName,
              title: currPage.data.courseinfo.title,
              titleImage: currPage.data.courseinfo.titleImage
          }).then((res) => {
            console.log("插入成功了????????")
          }).catch(
            console.log("查询数据库失败"),
            console.error
          );  // 写入studyinfo

          this.setData({  // 设置页面渲染数据
            activeTab: 1,
            isStudy: true
          })
          my.alert({
            content: "加入学习成功！！！"
          })
        }
      }
     });
 
  }

});
