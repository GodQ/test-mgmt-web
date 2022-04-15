import requests from '../utils/requests';

export const list_mock_servers = () => {
    // console.log(query);
    return requests.get('/mock_servers')
}

export const get_mock_server = (id) => {
    // console.log(query);
    return requests.get('/mock_servers/'+id)
}

export const start_mock_server = (id) => {
    // console.log(query);
    return requests.post('/mock_servers/'+id+'/start')
}

export const stop_mock_server = (id) => {
    // console.log(query);
    return requests.delete('/mock_servers/'+id+'/start')
}

export const update_mock_server = (id, data) => {
    // console.log(query);
    return requests.put('/mock_servers/'+id, data)
}

export const delete_mock_server = (id) => {
    // console.log(query);
    return requests.delete('/mock_servers/'+id)
}

export const create_mock_server = (data) => {
    // console.log(query);
    return requests.post('/mock_servers', data)
}