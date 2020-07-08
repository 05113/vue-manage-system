import request from '../utils/request'

export const create_testPlan = form =>{
    return request({
        url:'/create_testPlan',
        method:'post',
        data:form
    })
}
export const get_testPlan_listByProjectId = project_id =>{
    return request({
        url:'/get_testPlan_listByProjectId',
        method:'post',
        data:project_id
    }) 
}
export const get_testPlan_list = query =>{
    return request({
        url:'/get_testPlan_list',
        method:'post',
        data:query
    }) 
}
export const add_testPlan_task = testplan_id =>{
    return request({
        url:'/add_testPlan_task',
        method:'post',
        data:testplan_id
    }) 
}

