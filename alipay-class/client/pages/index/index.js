import { config } from './config';
import { log } from '../../utils';

Page({
  data: {
    // ...config,
    courseinfo: [],   // 数组
  },

  onLoad() {
    log.info('Page onLoad');
    my.getStorage({
      key: 'courseinfo',
      success: (res) => {
        console.log("获取缓存成功")
        console.log(res);
        console.log(res.data)
        if (res.data == null || res.data.courseinfo.length == 0) {  // 缓存为空, 或者存放的课程为空
          console.log("缓存为空");
          my.clearStorage();  // 异步清楚缓存后获取新的课程信息
          // let list = myutil.queryCourses();
          let list = [];
          my.serverless.db.collection('courseinfo').find()
          .then((res) => {
            console.log(res.success);
            console.log(res.result);
            if (res.success && res.result) {   // 如果函数返回成功，则赋值
              let data = res.result;
              for (let i=0; i<data.length; i++) {
                  list.push(data[i]);
              }
            }
            // 渲染页面数据
            this.setData({courseinfo: list});
            // 设置缓存
            my.setStorage({
              key: "courseinfo",
              data: {
                courseinfo: list
              },
              success: function() {
                console.log("首页数据缓存成功");
              }
            });
          }).catch(console.error);
        } else {  // 缓存中有课程信息
          this.setData({ 
            courseinfo: res.data.courseinfo
          });
        }
      },
      fail: () => {  // 缓存中无课程信息
        console.log("获取缓存失败")
      },
    });
 
  },

  onReady() {},


  // 转向课程详情页面
  toDetail(event) {
    console.log(event);
    let data = event.target.dataset.arg;
    console.log("data=" + data);
    my.navigateTo({
      url:"/pages/detail/detail?title=" + data,
    });
  }

});
