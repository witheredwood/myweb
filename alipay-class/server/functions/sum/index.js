
/**
 * serverless云函数文档地址: https://help.aliyun.com/document_detail/139203.html
 */

module.exports = async function sum (ctx) {
    const {a, b} = ctx.args;
    console.log("a = " + a + " b = " + b);
    return a + b;
};