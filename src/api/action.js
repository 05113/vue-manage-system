import request from '../utils/request';

export const actionData = query => {
    return request({   
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/get_action_list',
        method: 'post',
        data: query
    });
};
export const subData = rule => {
    return request({    
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/add_action',
        method: 'post',
        data: rule
    });
};
export const edit_action = action => {
    return request({
        url: '/edit_action',
        method:'post',
        data: action
    })

};
export const del_action =action_id =>{
    return request({
        url:'/del_action',
        method:'post',
        data:action_id
    })
};


