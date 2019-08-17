import requests from '../utils/requests';

export const fetchData = (query) => {
    // console.log(query);
    return requests.get('/api/test_result', query)
}

export const updateData = (data) => {
    // console.log(query);
    return requests.patch('/api/test_result', data)
}