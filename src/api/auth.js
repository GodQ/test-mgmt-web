import requests from '../utils/requests';

export const getToken = (username, password) => {
    var auth = {auth: {
        username: username,
        password: password
    }}
    return requests.get_service().post('/api/token', {}, auth)
}

export const useToken = (token) => {
    requests.set_auth_header(token)
}

export const updateData = (data) => {
    // console.log(query);
    return requests.patch('/api/test_result', data)
}
