import request from '../utils/request';

export const get_project_list = query => {
    return request({
        url: '/get_project_list',
        method: 'post',
        data: query
    });
};
export const get_project_listAll = () => {
    return request({
        url: '/get_project_listAll',
        method: 'post',
        data: ""
    });
};
export const delete_project = id => {
    return request({
        url: '/delete_project',
        method: 'post',
        data: id
    });
};
export const update_project = api_entity => {
    return request({
        url: '/update_project',
        method: 'post',
        data: api_entity
    });
};
export const create_project = api_entity => {
    return request({
        url: '/create_project',
        method: 'post',
        data: api_entity
    });
};
