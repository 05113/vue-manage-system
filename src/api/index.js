import request from '../utils/request';

export const fetchData = query => {
    return request({
        
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/get_project_list',
        method: 'post',
        data: query
    });
};
export const subData = project => {
    return request({
        
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/add_project',
        method: 'post',
        data: project
    });
};
export const getDataById = project_id => {
    return request({
        
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/get_projectById',
        method: 'post',
        data: project_id
    });
};
export const edit_project = project => {
    return request({
        url: '/edit_project',
        method:'post',
        data: project
    })

};
export const del_project =project_id =>{
    return request({
        url:'/del_project',
        method:'post',
        data:project_id
    })
};


