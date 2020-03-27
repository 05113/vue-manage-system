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
}

