import axios from 'axios';
import qs from 'qs'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // baseURL: 'https://www.easy-mock.com/mock/5d557cd43648ff2af04ca991/test-mgmt',
    // baseURL: 'http://10.110.124.130:5000', 
    timeout: 60000,
    headers: {
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json'
    }
})
service.defaults.timeout = 60000

// service.interceptors.request.use( config => {
//     return config;
// }, error => {
//     console.log(error);
//     return Promise.reject();
// })

// service.interceptors.response.use(response => {
//     if(parseInt(response.status/100) === 2){
//         // console.log(response.data)
//         return response;
//     }else{
//         return Promise.reject();
//     }
// }, error => {
//     console.log(error);
//     return Promise.reject();
// })

export default {
    get_service() {
        return service
    },

    // set_auth_header(token) {
    //     service.defaults.headers.common['Authorization'] = 'Bearer '+token;
    // },

    get(url, params) {
        if (!url) return;
        return service({
            url: url,
            method: 'get',
            params: params,
            headers: {
                'Authorization': 'Bearer '+ sessionStorage.getItem('auth.access_token')
            }
        })
    },
    delete(url, params) {
        if (!url) return;
        return service({
            url: url,
            method: 'delete',
            params: params,
            headers: {
                'Authorization': 'Bearer '+ sessionStorage.getItem('auth.access_token')
            }
        })
    },
    post(url, data) {
        if (!url) return;
        return service({
            method: 'post',
            url: url,
            // data: qs.stringify(data),
            data: data,
            headers: {
                'Authorization': 'Bearer '+ sessionStorage.getItem('auth.access_token')
            }
        })
    },
    put(url, data) {
        if (!url) return;
        return service({
            method: 'put',
            url: url,
            data: data,
            headers: {
                'Authorization': 'Bearer '+ sessionStorage.getItem('auth.access_token')
            }
        })
    },
    patch(url, data) {
        if (!url) return;
        return service({
            method: 'patch',
            url: url,
            data: data,
            headers: {
                'Authorization': 'Bearer '+ sessionStorage.getItem('auth.access_token')
            }
        })
      }
}