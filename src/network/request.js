import axios from 'axios'

export function request(config) {
  //1、创建实例
  const instance = axios.create({
    baseURL:'http://127.0.0.1:9001', //约定
  timeout:100000
  })
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  //3、发送网络请求
  return instance(config)
}
