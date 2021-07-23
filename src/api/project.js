import requests from '../utils/requests';

export const listProjects = () => {
    return requests.get('/api/projects')
}

export const addProject = (data) => {
    var project = {
        project_id: data.project_id
    }
    return requests.post('/api/projects', project)
}

export const deleteProject = (project_id) => {
    return requests.delete('/api/projects/'+project_id)
}
