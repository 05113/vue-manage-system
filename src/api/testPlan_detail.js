import request from '../utils/request'

export const create_testPlan_detail = testplan_detail=>{
    return request({
        url:'/create_testPlan_detail',
        method:'post',
        data:testplan_detail
    })
}
export const get_testPlan_detail_list = query =>{
    return request({
        url:'/get_testPlan_detail_list',
        method:'post',
        data:query
    }) 
}
export const delete_testPlan_detail = testplan_detail =>{
    return request({
        url:'/delete_testPlan_detail',
        method:'post',
        data:testplan_detail
    }) 
}
export const update_test_api_group = table_data =>{
    return request({
        url:'/update_test_api_group',
        method:'post',
        data:table_data
    }) 
}

