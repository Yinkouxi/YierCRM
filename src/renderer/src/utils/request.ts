import axios, { AxiosInstance, AxiosResponse } from 'axios';
import router from '@router'
import { ElMessage } from 'element-plus';
const request = axios.create({
    baseURL: '/api'
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {

    let token:string | null = localStorage.getItem('TOKEN');
    if( token ){
      config.headers['Authorization'] = token;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});


// 添加响应拦截器
request.interceptors.response.use(function (response) {
  let { code , msg } = response.data;
  //token过期
  if(  code =='50003' ){
    ElMessage({
      type:'info',
      message:msg
    })
    localStorage.removeItem('TOKEN');
    router.push('/login');
    return Promise.reject();
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

const http = {
    get<T>(url: string, params?: any, config?: {}): Promise<T> {
      return new Promise((resolve, reject) => {
        request
          .get<T>(url, { params,...config } )
          .then((res: AxiosResponse<T>) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    post<T>(url: string, data?: any, config?: {}): Promise<T> {
      return new Promise((resolve, reject) => {
        request
          .post<T>(url, data, config)
          .then((res: AxiosResponse<T>) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
};

export default http;
