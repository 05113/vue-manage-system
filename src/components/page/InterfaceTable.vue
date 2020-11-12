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
                <el-button type="primary" size="medium" @click="addApi">显示参数</el-button>
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
                @selection-change="handleSelectionChange"
                row-key="id"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="api_name" label="接口名称"></el-table-column>
                <el-table-column prop="api_url" label="接口url"></el-table-column>
                <el-table-column prop="request_json" label="request_json"></el-table-column>
                <el-table-column prop="assert_case" label="assert_case"></el-table-column>
                <el-table-column prop="data_out" label="data_out"></el-table-column>
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
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="updateApi(scope.$index, scope.row)"
                        >修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.limit"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title= subtype :visible.sync="editVisible" width="30%">
            <el-row v-for="item in data_out" span= "12" type="flex" justify="center" style="margin-top:5px">
                <el-col :span = 4>
                    <el-input  v-model="item.data_out_key"></el-input>
                </el-col>
                <el-col :span = 4  >
                    <p align="center">=</p>
                </el-col>
                <el-col :span = 4 >
                    <el-input  v-model="item.data_out_value"></el-input>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDataOut">新 增</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>               
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get_test_api_list } from '../../api/interface';
import { run_test_api } from '../../api/test_api';
import { get_single_out_data } from '../../api/test_api';
import { update_single_out_data } from '../../api/test_api';


import { run_api_list } from '../../api/api';
import { create_api } from '../../api/api';


import Base from '../common/Header'
import Sortable from 'sortablejs';
const db = window.localStorage

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                page: 1,
                limit: 10,
                project_id:""
            },
            subtype:"",
            url:Base.baseURL,
            queryName:"",
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            interface_entity: {
                id:"",
                api_name:"",
                api_url:"",
                request_json:"",
                assert_case:"",
                data_out:""

            },
            data_out:[],
            // {
            //     data_out_key:"",
            //     data_out_value:""
            // },
            idx: -1,
            id: -1,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        addDataOut(){
            this.data_out.push({
                "data_out_key":"",
                "data_out_value":""
            })
        },
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
                    console.log(_this.tableData)
                    console.log("wwwww",currrow)
                    //将拖拽的行新增到指定newIndex位置
                    _this.tableData.splice(newIndex, 0, currrow)
                    console.log("ascasca",_this.tableData)
                    // _this.$$nextTick(function (){

                    // })
                }
            });
        },     
        getData(id) {
            // this.query.project_id = db.getItem("id")
            // console.log("queret1",this.query.project_id)
            this.query.project_id = id
            if (this.query.project_id === undefined){
                this.query.project_id = db.getItem("id")
                // console.log("queret2",this.query.project_id)

            }
            // console.log("queret",this.query.project_id)
            // console.log("queret",this.query)
            get_test_api_list(this.query).then(res => {
                // console.log(res);
                this.tableData = res.data;
                this.pageTotal = res.count || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            // this.$set(this.query, 'pageIndex', 1);
            // this.getData();
            console.log("aaaaaaaaa",this.tableData)

        },
        // 删除操作 index代表选行为第几行(从0开始),row代表这一整行的所有数据
        handleDelete(index, row) {
            console.log("url",this.url)
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    console.log("index",index)
                    console.log("row",row)
                    delete_api(row.id).then(res => {
                        console.log("resdel",res)
                        if (res.code === "200") {
                            this.$message.success(res.msg);
                            console.log(res);
                            this.getData();
                        }
                        if (res.code === "201") {
                            this.$message.success(res.err_detail);
                            this.getData();
                        }
                    })
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
            // console.log("wor",row.id)
            run_test_api(row.id).then(async res =>{
                console.log("resaaa:",res)
                if(res.assert_words === 'Faild'){
                    this.$message.error('接口执行失败，请检查请求体')
                }else{
                    if(res.assert_words === 'False'){
                        await this.$message.error('返回与预期结果不一致')
                    }
                    else{
                        await this.$message.success('返回与预期结果一致')
                    }
                }
                if(res.match_detail.msg === 'False'){
                    // console.log(res.match_detail.value)
                    this.$message.warning('出参存在问题 :value = '+res.match_detail.value);
                }
            })
            
        },
        //新建操作
        addApi() {
            this.subtype = '参数列表'
            this.api_entity = {}
            this.editVisible = true;
            this.data_out = []
            get_single_out_data(this.query.project_id).then(res =>{
                console.log(res)
                for(let item in res){
                    this.data_out.push({
                        "data_out_key":item,
                        "data_out_value":res[item]
                    })
                }
                console.log(this.data_out)
            })
            
        },
        updateApi(index,row){
            this.$router.push({
                path:'/interface_update',
                query: {
                    api_id: row.id
                    }
            })
            
        },
        // 提交操作
        submitForm() {
            this.editVisible = false;
            console.log(this.data_out)
            update_single_out_data(this.data_out).then(res =>{
                console.log(res)

            })
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
                create_api(this.api_entity).then(res=>{
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
    computed: {          
        getSearchKey(){
            return this.$store.state.searchKey
        }
    },
    watch:{
        getSearchKey(newVal, oldVal){
            console.log("aaaaa111a",newVal,oldVal)
            this.getData(newVal)
        }
    }
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
