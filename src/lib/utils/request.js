import axios from 'axios';
import Cookies from 'js-cookie';
// import { message } from 'antd';
import message from 'antd/es/message';
const service = axios.create(),
  ejection = {};
//添加请求拦截器
service.interceptors.request.use(function (config) {
  config.headers['TOKEN'] = Cookies.get('TOKEN');
  return config
}, function (error) {
  return Promise.reject(error)
})
//添加响应拦截器
service.interceptors.response.use((response) => {
  /**
  * 下面的注释为通过在response里，自定义code来标示请求状态
  * 当code返回如下情况则说明权限有问题，登出并返回到登录页
  * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
  */
  const res = response.data;
  if (res.success === 0) {
    return response.data;
  } else {
    message.info(res.errorMessage);
    if (response.config.$opts && response.config.$opts.continue) {
      return Promise.reject(res);
    }
    return ejection;
  }
}, error => {
  return Promise.reject(error)
}
)
export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      service({
        method: 'get',
        url,
        params: param,
      }).then(res => {  //axios返回的是一个promise对象
        if (res !== ejection) {
          resolve(res.data);
        }  //resolve在promise执行器内部
      }).catch(err => {
        reject(err);
      })

    })
  },
  //del请求
  del(url, param) {
    return new Promise((resolve, reject) => {
      service({
        method: 'delete',
        url,
        params: param,
      }).then(res => {  //axios返回的是一个promise对象
        if (res !== ejection) {
          resolve(res.data);
        }  //resolve在promise执行器内部
      }).catch(err => {
        reject(err);
      })

    })
  },
  //post请求
  post(url, param, opts) {
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        url,
        data: param,
        $opts: opts,
      }).then(res => {
        if (res !== ejection) {
          console.log('res', res);
          resolve(res.data);
        }
      }).catch(err => {
        reject(err);
      })
    })
  }
}
