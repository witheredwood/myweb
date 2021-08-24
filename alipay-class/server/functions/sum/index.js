
/**
 * serverless云函数文档地址: https://help.aliyun.com/document_detail/139203.html
 */
// 这个求和函数是记录自己编写云函数，和功能无关
module.exports = async function sum (ctx) {
    const {a, b} = ctx.args;
    console.log("a = " + a + " b = " + b);
    return a + b;
};