import request from '../utils/request';

export const pathTree = branch => {
    return request({
        url: '/pathTree',
        method: 'post',
        data: branch
    });
};
export const get_branchlist = () => {
    return request({
        url: '/get_branchlist',
        method: 'post',
        data: ''
    });
};
export const add_case_test_plan = testPlan => {
    return request({
        url: '/add_case_test_plan',
        method: 'post',
        data: testPlan
    });
};

