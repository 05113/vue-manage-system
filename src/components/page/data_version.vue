<template>
    <div>
        <div class="crumbs">
            <!-- 基础表格 -->
            <el-breadcrumb separator="/">
                <!-- 点击每级都可以进行跳转  一级->二级->三级 -->
                <!-- <el-breadcrumb-item :to="{paht:'/'}">
                    <i class="el-icon-lx-cascades"></i> 首页
                </el-breadcrumb-item> -->
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 固定单据
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 新增弹出界面 -->
            <div class="handle-box">
　              <el-button type="primary" size="medium" @click="addData_version(form)">新建数据</el-button>
            </div>  
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
            <!-- prop对应response返回的key值 -->
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="数据版本ID" width="55" align="center"></el-table-column>
                <el-table-column prop="data_version_no" label="数据版本号"></el-table-column>
                <el-table-column prop="project_id" label="项目ID"></el-table-column>
                <el-table-column prop="project_name" label="项目名称"></el-table-column>
                <el-table-column prop="rule_type" label="测试场景"></el-table-column>
                <el-table-column prop="rule_id" label="数据生成策略id"></el-table-column>
                <el-table-column prop="rule_name" label="数据生成策略名"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column label="操作" width="550" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >下载</el-button>
                            <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页导航 -->
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

        <!-- 弹出新建框 -->
        <el-dialog title="新建数据" :visible.sync="dialogFormVisible" width="50%">
            <el-form ref="form" :model="data_version" label-width="70px">
                <el-row>
                    <el-form-item label="项目" prop="project_id">
                        <el-select v-model="data_version.project_id" filterable placeholder="请选择">
                            <el-option
                            v-for="item in project_options"
                            :label="item.project_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="数据策略" prop="rule_id">
                        <el-select v-model="data_version.rule_id" filterable placeholder="请选择">
                            <el-option
                            v-for="item in rule_options"
                            :label="item.rule_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                        <!-- 加上:key="'project_'+item.id" 会重复两遍导致 warnDuplicate keys detected -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
                    <!-- 是否是集合单 -->
                    <!-- <el-col :span="8">
                    </el-col> 
                    <el-col :span="8">
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-row>
            </el-form>
            
        </el-dialog>  -->
    </div>
</template>

<script>
//引用此文件目录的方法
import { data_versionData } from '../../api/data_version';
import { fetchData } from '../../api/index';
import { ruleData } from '../../api/rule';
import { subData } from '../../api/data_version';
// import {getDataById} from '../../api/rule';
// import {edit_rule} from '../../api/rule';
import {del_data} from '../../api/data_version';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                page: 1,
                limit: 2
            },
            options_query:{
                page:1,
                limit:""
            },
            rule_count:"",
            project_count:"",
            data_version:{
                    data_version_no:"",
                    project_id:"",
                    project_name:"",
                    rule_type:"",
                    rule_id:"",
                    rule_name:"",
                    state:"",
                    owner:""              
            },
            data_version_id:{
                id:""
            },
            project_options:[],
            rule_options:[],
            tableData: [],
            multipleSelection: [],
            dialogFormVisible: false,
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            subtype: "",    
        };
    },
    created() {
        this.getData();
        // this.get_options();
    },
    methods: {
        //统计数量
        // get_count(){
        //         ruleData(this.query).then(res => {
        //             console.log("res",res.count)
        //         this.rule_count = res.count;
        //         console.log("count",this.rule_count)
        //     }),
        //         fetchData(this.query).then(res => {
        //         this.project_count = res.count;
        //     });        
        // },
        get_options(){
                ruleData(this.query).then(res => {
                    this.options_query.limit = res.count;
                    ruleData(this.options_query).then(res =>{
                        for(let item of res.data){
                            this.rule_options.push({"id":item.id,"rule_name":item.rule_name})          
                        }
                    })
            }),
                fetchData(this.query).then(res => {
                    this.options_query.limit = res.count;
                    fetchData(this.options_query).then(res =>{
                        console.log("res",res)
                        for(let item of res.data){
                            this.project_options.push({"id":item.id,"project_name":item.project_name})          
                        }
                        console.log("project options",this.project_options)
                    })
            })
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            data_versionData(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.count || 50;  
                this.get_options()
                     
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {

            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    //通过row获取form数据
                    this.form = row
                    console.log("del:form_id,",this.form.id)                  
                    this.data_version_id.id = this.form.id
                    del_data(this.data_version_id).then(res =>{
                    // console.log(res.code)
                        // this.rule = res.msg
                        // console.log("del rule",this.rule)
                        this.getData()
                    });
                    this.$message.success('删除成功');
                    // this.tableData.splice(index, 1);eltable减少一行
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            console.log("xinxi:" ,val)
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
        // 编辑操作
        handleEdit(index, row) {
            this.subtype = "edit"
            this.idx = index;
            this.form = row;
            this.dialogFormVisible = true;
            this.rule_id.id = this.form.id
            // console.log("projectId",this.project_id.id)
            getDataById(this.rule_id).then(res =>{
                // console.log(res.code)               
                //typeof()查看变量类型
                console.log("rule",res.msg[0])
                this.rule.rule_detail = JSON.parse(res.msg[0].rule_detail)
                this.rule.rule_name = res.msg[0].rule_name
                this.rule.send_batch_num = res.msg[0].send_batch_num
                this.rule.rule_type = res.msg[0].rule_type
                this.rule.owner = res.msg[0].owner 
                this.rule.id = res.msg[0].id
            });
            // const _selectData = this.$refs.itsmDataTable.selection
        },
        resetForm(form) {
            this.$nextTick(()=>{
                if (this.$refs.form !== undefined) {
                    console.log("aaaaaaaarest")
                    this.$refs.form.resetFields();
                    }
                })                
            },
        //新建操作,弹出对话框
        // 首先定义dialogFormVisible为false，通过事件触发方法改为true
        addData_version(form){
            // 对话框显示
            this.subtype = "creat"
            this.dialogFormVisible = true;
            this.resetForm(this.form)

        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
        open(errdetail) {
        this.$message(errdetail);
        },
        //提交修改和新建的数据
        //通过axios提交到后端
        //双向绑定数据，使填入的input数据进行传输
        submitForm(){
            if(this.subtype == 'creat'){
                console.log("submutForm1",this.data_version)
                subData(this.data_version).then(res => {
                    if(res.code == '201'){
                        this.open(res.err_detail)
                        }  
                    if(res.code =='200'){
                        this.dialogFormVisible = false
                        this.$message.success(`新增成功`);
                        this.getData()
                    }                    
                    }).catch();
                }
            if(this.subtype == 'edit'){  
                console.log("submutForm2",this.rule)
                edit_rule(this.rule).then(res => {
                    if(res.code == '201'){
                        this.open(res.err_detail)
                        }
                    if(res.code =='200'){
                    this.dialogFormVisible = false
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.getData()
                }   
                    }).catch();
                }
            this.dialogFormVisible = false
            this.getData()
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
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
