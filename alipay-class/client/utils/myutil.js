export function queryCourses() {
  // 在前端直接调用serverless的数据库函数，不需要自己写云函数
  let list = [];
  my.serverless.db.collection('courseinfo').find()
  .then((res) => {
    if (res.success && res.result) {   // 如果函数返回成功，则赋值
      let data = res.result;
      // let list = [];
      for (let i=0; i<data.length; i++) {
          list.push(data[i]);
      }
      console.log(" queryCourses ==> ", list);
    }
      return list;

  })
   
};