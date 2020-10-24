import requests from '../utils/requests';

export const fetchSummary = (data) => {
    // console.log(query);
    return requests.get('/api/summary', data)
}

export const fetchData = (query) => {
    // console.log(query);
    return requests.get('/api/test_result', query)
}

export const fetchDiffData = (query) => {
    // console.log(query);
    return requests.get('/api/test_result_diff', query)
}

export const fetchDetails = (query) => {
    // console.log(query);
    return requests.get('/api/test_result', query)
}

export const updateData = (data) => {
    // console.log(query);
    return requests.patch('/api/test_result', data)
}

export const fetchTestrunList = (data) => {
    // console.log(query);
    return requests.get('/api/testruns', data)
}

export const fetchIndexList = (data) => {
    // console.log(query);
    return requests.get('/api/test_index', data)
}