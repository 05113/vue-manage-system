import axios from 'axios';
import { Message } from 'element-ui';
 let VUE_APP_BASE_URL = 'http://172.31.254.167:9995'
//  let VUE_APP_BASE_URL = 'http://192.168.29.92:9995'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    //baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL:VUE_APP_BASE_URL,
    timeout: 5000,
    headers:{'content-type': 'application/json'}
});

service.interceptors.request.use(
    config => {
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // if(config.method === 'post')
        // config.data = qs.stringify( {
        //     ...config.data
        // })
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        
        Message({
            message:"请求错误",
            type: "error",
        })
        // Message.closeAll()
        return Promise.reject();
    }
);

export default service;
