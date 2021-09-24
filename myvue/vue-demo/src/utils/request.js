import axios from 'axios';

// 初始化一个 axios 对象
const service = axios.create({
    baseURL: '/api',
    timeout: 5000,  // 超时时间， 5s
    headers: {
        'Context-Type': 'application/json'
    }
});


// 请求前的拦截
service.interceptors.request.use(
    req => {
        let token = sessionStorage.getItem('token');
        if (token) {
            req.headers['token'] = token;
        }
        return req;
    },
    error => {
        console.log(error);
        Promise.reject(error);
    }
);
// 请求响应后的拦截
service.interceptors.response.use(
    response => {
        // 存起来
        response.data.token && sessionStorage.setItem('token', response.data.token);

    },
    error => {
        switch (error.status) {
            case 401:
                sessionStorage.removeItem('token');  // 清除token
            // 跳转到登录页面
        }
        // 错误
        return Promise.reject(error.response.data);
    }
);

export default service;
