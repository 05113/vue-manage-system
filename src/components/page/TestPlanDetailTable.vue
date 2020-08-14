<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="medium" @click="addApi">新增接口</el-button>
                <el-button type="primary" size="medium" @click="update_test_api_group">保存</el-button>
                <div class="handle-box1">
                    <el-input
                        v-model="queryName"
                        placeholder="请输入项目ID"
                        class="handle-input mr10"
                        @keyup.native="number"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                row-key="id"
                @selection-change="handleSelectionChange"
            >
                <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="序号"></el-table-column> -->
                <el-table-column prop="api_name" label="接口名称"></el-table-column>
                <el-table-column prop="api_url" label="接口url"></el-table-column>
                <el-table-column prop="request_json" label="request_json"></el-table-column>
                <el-table-column prop="assert_case" label="assert_case"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="run_api(scope.$index, scope.row)"
                        >run</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除1</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total"
                    :current-page="query.page"
                    :page-size="pageTotal"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title= subtype :visible.sync="editVisible" width="30%">
            <el-form ref="api_entity" :model="testplan_detail" label-width="70px">
                <!-- <el-form-item label="接口名称">
                    <el-input v-model="testplan_detail.test_api_id"></el-input>
                </el-form-item> -->
                    <el-select v-model="testplan_detail.test_api_id" placeholder="请选择" filterable >
                        <el-option
                            v-for="item in testApi_options"
                            :key="item.id"
                            :label="item.api_name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get_testPlan_listByProjectId } from '../../api/testPlan';
import { get_testPlan_detail_list } from '../../api/testPlan_detail';
import { run_test_api } from '../../api/test_api';
import { run_api_list } from '../../api/api';
import { create_testPlan_detail } from '../../api/testPlan_detail';
import { delete_testPlan_detail } from '../../api/testPlan_detail';
import { update_test_api_group } from '../../api/testPlan_detail';


import Sortable from 'sortablejs';
import Base from '../common/Header'
const db = window.localStorage

export default {
    name: 'basetable',
    data() {
        return {
            project_id:"",
            query: {
                testplan_id:""
            },
            subtype:"",
            url:Base.baseURL,
            queryName:"",
            tableData: [],
            testApi_options:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            testplan_detail: {
                testplan_id:"",
                test_api_id:""
            },
            idx: -1,
            id: -1,
        };
    },
    created() {
        this.getData();
    },
    watch:{
      '$route': 'getData'
    },
    methods: {
        //新增 获取projectid
        rowDrop(){
            const tbody = document.querySelector('.el-table__body-wrapper tbody');
            const _this = this;
            let data = [];
            Sortable.create(tbody,{
                draggable: ".el-table__row",
                onEnd ({ newIndex, oldIndex}){                    
                    // data = _this.tableData;
                    //删除并获取拖拽的行
                    const currrow = _this.tableData.splice(oldIndex, 1)[0]
                    //将拖拽的行新增到指定newIndex位置
                    _this.tableData.splice(newIndex, 0, currrow)
                }
            });
        }, 
        getData() {   
            this.project_id = db.getItem('id')
            this.tableData = []
            //获得下拉框新增数据
            get_testPlan_listByProjectId(this.project_id).then(res =>{
                if(res.data != ""){
                    this.testApi_options = []
                    for(let item of res.data){
                        this.testApi_options.push({
                        'id': item.id,
                        'api_name': item.api_name
                    }) 
                }
                }              
            })
            this.query.testplan_id = this.$route.query.id         
            console.log("queret",this.query)
            if(this.query.testplan_id != undefined){
                //获得列表数据
                get_testPlan_detail_list(this.query).then(res => {
                if(res.data != ""){
                    this.tableData = res.data;
                    this.pageTotal = res.count || 50;
                }
            });
            }

        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            console.log(this.tableData)
            // this.getData();
        },
        update_test_api_group(){
            let table_data = {
                'testplan_id':"",
                'table_data':""
            }
            table_data.testplan_id = this.query.testplan_id,
            table_data.table_data = this.tableData
            
            console.log("table_data",table_data)
            update_test_api_group(table_data).then(res =>{
                if (res.code === "200") {
                    this.$message.success(res.msg);
                    this.getData();
                }
                if (res.code === "201") {
                    this.$message.error(res.msg);
                    this.getData();
                }
            })
            
        },
        // 删除操作 index代表选行为第几行(从0开始),row代表这一整行的所有数据
        handleDelete(index, row) {
            console.log("url",this.url)
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.testplan_detail.testplan_id = this.query.testplan_id
                    this.testplan_detail.test_api_id = index
                    console.log("delete api",this.testplan_detail)
                    delete_testPlan_detail(this.testplan_detail).then(res => {
                        console.log("resdel",res)
                        if (res.code === "200") {
                            this.$message.success(res.msg);
                            console.log(res);
                            this.getData();
                        }
                        if (res.code === "201") {
                            this.$message.error(res.err_detail);
                            this.getData();
                        }
                    })
                    console.log("accascasc")
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // run
        run_api(index, row) {
            console.log("wor",row.id)
            run_test_api(row.id).then(res =>{
                console.log("resaaa:",res)
                this.$message.success(res);
            })    
        },
        //新建操作
        addApi() {
            this.subtype = 'create'
            this.api_entity = {}
            this.editVisible = true;
        },
        // 提交操作
        submitForm() {
            this.editVisible = false;
            if(this.subtype === 'edit'){
                update_api(this.api_entity).then(res=>{
                    console.log(res)
                    if (res.code === "200") {
                        this.$message.success(res.msg);
                        console.log(res);
                        this.getData();
                    }
                    if (res.code === "201") {
                        this.$message.success(res.err_detail);
                        this.getData();
                    }
                }).catch()
            }
            if(this.subtype === 'create'){
                this.testplan_detail.testplan_id = this.query.testplan_id
                create_testPlan_detail(this.testplan_detail).then(res=>{
                    if (res.code === "200") {
                        this.$message.success(res.msg);
                        console.log(res);
                        this.getData();
                    }
                    if (res.code === "201") {
                        this.$message.success(res.err_detail);
                        this.getData();
                    }
                }).catch()
            }


            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        }
    },
    mounted(){
        this.rowDrop();
    },
};
</script>

<style scoped>

.handle-box {
    margin-bottom: 20px;
}
.handle-box1{
    display:inline-block;
    text-align: right;
    /* padding-right: 500px; */
    margin-left: 60%;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
