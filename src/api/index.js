import request from '../utils/request';

export const fetchData = (query) => {
    return request({
        url: '/test_report',
        method: 'get',
        data: query
    })
}