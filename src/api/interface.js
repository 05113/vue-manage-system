import request from '../utils/request';

export const get_test_api_list = query => {
    return request({
        url: '/get_test_api_list',
        method: 'post',
        data: query
    });
};
export const get_api_listAll = () => {
    return request({
        url: '/get_api_listAll',
        method: 'post',
        data: ""
    });
};
export const delete_api = id => {
    return request({
        url: '/delete_api',
        method: 'post',
        data: id
    });
};
export const update_api = api_entity => {
    return request({
        url: '/update_api',
        method: 'post',
        data: api_entity
    });
};
export const create_api = api_entity => {
    return request({
        url: '/create_api',
        method: 'post',
        data: api_entity
    });
};
