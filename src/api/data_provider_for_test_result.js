import requests from '../utils/requests';

export const fetchSummary = (data) => {
    // console.log(query);
    return requests.get('/api/summary', data)
}

export const fetchTestResults = (project_id, query) => {
    // console.log(query);
    return requests.get("/api/projects/"+project_id+"/test_results", query)
}

export const fetchDiffData = (project_id, query) => {
    // console.log(query);
    return requests.get("/api/projects/"+project_id+"/test_result_diff", query)
}

export const updateTestResults = (project_id, data) => {
    // console.log(query);
    return requests.patch("/api/projects/"+project_id+"/test_results", data)
}

export const fetchTestrunList = (project_id, data) => {
    // console.log(query);
    return requests.get("/api/projects/"+project_id+"/testruns", data)
}

export const fetchProjectList = (data) => {
    // console.log(query);
    return requests.get('/api/projects', data)
}