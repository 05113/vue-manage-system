import request from '../utils/request';

export const ruleData = query => {
    return request({   
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/get_rule_list',
        method: 'post',
        data: query
    });
};
export const subData = rule => {
    return request({    
        //  url: './table.json',
        //  模板使用的 table.json
        url:'/add_rule',
        method: 'post',
        data: rule
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
export const del_rule =rule_id =>{
    return request({
        url:'/del_rule',
        method:'post',
        data:rule_id
    })
};
export const run_data =rule_id =>{
    return request({
        url:'/run_data',
        method:'post',
        data:rule_id
    })
};


