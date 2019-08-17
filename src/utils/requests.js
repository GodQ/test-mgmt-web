import axios from 'axios';
import qs from 'qs'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // baseURL: 'https://www.easy-mock.com/mock/5d557cd43648ff2af04ca991/vue-admin',
    timeout: 5000
})

// service.interceptors.request.use( config => {
//     return config;
// }, error => {
//     console.log(error);
//     return Promise.reject();
// })

service.interceptors.response.use(response => {
    if(parseInt(response.status/100) === 2){
        console.log(response.data)
        return response;
    }else{
        return Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default {
    get(url, params) {
        if (!url) return;
        return service({
            url: url,
            method: 'get',
            params: params
        })
    },
    delete(url, params) {
        if (!url) return;
        return service({
            url: url,
            method: 'delete',
            params: params
        })
    },
    post(url, data) {
        if (!url) return;
        return service({
            method: 'post',
            url: url,
            data: qs.stringify(data),
        })
    },
    put(url, data) {
        if (!url) return;
        return service({
            method: 'put',
            url: url,
            data: data
        })
    },
    patch(url, data) {
        if (!url) return;
        return service({
            method: 'patch',
            url: url,
            data: data
        })
      }
}