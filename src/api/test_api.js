import request from '../utils/request'

export const create_test_api = form =>{
    return request({
        url:'/create_test_api',
        method:'post',
        data:form
    })
}
export const run_test_api = id =>{
    return request({
        url:'/run_test_api',
        method:'post',
        data:id
    }) 
}