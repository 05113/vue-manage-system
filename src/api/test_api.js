import request from '../utils/request'

export const create_test_api = form =>{
    return request({
        url:'/create_test_api',
        method:'post',
        data:form
    })
}
export const update_test_api = form =>{
    return request({
        url:'/update_test_api',
        method:'post',
        data:form
    })
}
export const get_test_apiById = api_id =>{
    return request({
        url:'/get_test_apiById',
        method:'post',
        data:api_id
    })
}
export const run_test_api = id =>{
    return request({
        url:'/run_test_api',
        method:'post',
        data:id
    }) 
}
export const get_single_out_data = project_id =>{
    return request({
        url:'/get_single_out_data',
        method :'post',
        data:project_id
    })
}
export const update_single_out_data = data_out =>{
    return request({
        url:'/update_single_out_data',
        method :'post',
        data:data_out
    })
}