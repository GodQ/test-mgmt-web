import request from '../utils/request';

export const fetchData = (query) => {
    console.log(query)
    return request({
        url: '/api/test_result',
        method: 'patch',
        data: query
    })
}