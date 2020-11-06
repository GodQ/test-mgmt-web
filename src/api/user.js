import requests from '../utils/requests';

export const listUsers = () => {
    return requests.get('/api/users')
}

export const addUser = (data) => {
    var user = {
        user_name: data.user_name,
        password: data.password,
        role: data.role
    }
    return requests.post('/api/users', user)
}

export const editUser = (username, password, role) => {
    let user = {
        user_name: username,
        password: password,
        role: role
    }
    console.log(user)
    return requests.put('/api/users', user)
}

export const deleteUser = (username) => {
    return requests.delete('/api/users/'+username)
}
