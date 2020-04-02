import request from '../utils/request';

export const data_versionData = query => {
    return request({   
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/get_data_list',
        method: 'post',
        data: query
    });
};
export const subData = data_version => {
    return request({    
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/add_data',
        method: 'post',
        data: data_version
    });
};
export const getDataById = rule_id => {
    return request({     
        url:'/get_ruleById',
        method: 'post',
        data: rule_id
    });
};
export const edit_rule = rule => {
    return request({
        url: '/edit_rule',
        method:'post',
        data: rule
    })

};
export const del_data =data_version_id =>{
    return request({
        url:'/del_data',
        method:'post',
        data:data_version_id
    })
};


