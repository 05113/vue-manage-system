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
                    <i class="el-icon-lx-cascades"></i> 测试执行
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
　              <el-button type="primary" size="medium" @click="addData_version(form)">新建测试</el-button>
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
                <el-table-column prop="id" label="策略ID" width="55" align="center"></el-table-column>
                <el-table-column prop="project_id" label="项目ID"></el-table-column>
                <el-table-column prop="project_name" label="项目名称"></el-table-column>
                <el-table-column prop="rule_id" label="策略ID"></el-table-column>
                <el-table-column prop="rule_name" label="策略名"></el-table-column>
                <el-table-column prop="rule_type" label="测试场景"></el-table-column>
                <el-table-column prop="data_type" label="数据类型" :formatter="dataFormatter"></el-table-column>
                <el-table-column prop="data_version_id" label="数据版本id"></el-table-column>
                <el-table-column prop="data_version_no" label="数据版本号"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="data_backup" label="是否已备份" :formatter="data_backupFormatter"></el-table-column>
                <!-- <el-table-column prop="data_backup" label="数据备份"></el-table-column> -->
                <el-table-column label="操作" width="550" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >详情</el-button>
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

        <!-- 弹框 -->
        <el-dialog :title="dailogTitleType" :visible.sync="dialogFormVisible" width="50%">
            <el-form ref="form" :model="action" :inline="true" label-width="70px">
                <el-row>
                    <el-form-item label="项目" prop="project_id">
                        <el-select v-model="action.project_id" filterable placeholder="请选择">
                            <el-option
                            v-for="item in project_options"
                            :label="item.project_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="策略" prop="rule_id">
                        <el-select v-model="action.rule_id" filterable placeholder="请选择">
                            <el-option
                            v-for="item in rule_options"
                            :label="item.rule_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="数据类型" prop="data_type">
                        <el-select v-model="action.data_type" filterable placeholder="请选择">
                            <el-option
                            v-for="item in datatype_options"
                            :label="item.value"
                            :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="数据版本" prop="data_version_id">
                        <el-select v-model="action.data_version_id" filterable placeholder="请选择">
                            <el-option
                            v-for="item in data_options"
                            :label="item.data_version_no"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>      
                    <el-form-item label="发送频率区间" prop="send_frequency_min">
                    <el-input v-model="action.send_frequency_min"></el-input>
                    </el-form-item>到
                    <el-form-item  prop="send_frequency_max">
                    <el-input v-model="action.send_frequency_max"></el-input>
                    </el-form-item>      
                </el-row>
                <el-row>
                    <el-form-item label="数据类型" prop="data_backup">
                        <el-select v-model="action.data_backup" filterable placeholder="请选择">
                            <el-option
                            v-for="item in databackup_options"
                            :label="item.value"
                            :value="item.key">
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
    </div>
</template>

<script>
//引用此文件目录的方法
import { data_versionData } from '../../api/data_version';
import { fetchData } from '../../api/index';
import { ruleData } from '../../api/rule';
import { subData } from '../../api/action';
import {actionData} from '../../api/action'
// import {getDataById} from '../../api/rule';
import {edit_action} from '../../api/action';
import {del_action} from '../../api/action';
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
            action:{
                    project_id:"",
                    rule_id:"",
                    data_type:"",
                    data_version_id:"",
                    send_frequency_min:"",
                    send_frequency_max:"",
                    data_backup:""              
            },
            datatype_options:[{"key":"FIXED","value":"固定单据"},{"key":"RANDOM","value":"策略随机单据"}],
            databackup_options:[{"key":"NO","value":"不备份"},{"key":"INIT","value":"待备份"},{"key":"DOING","value":"备份中"},{"key":"DONE","value":"已备份"}],
            action_id:{
                id:""
            },
            project_options:[],
            rule_options:[],
            data_options:[],
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
            dailogTitleType:""  
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
            }),
                data_versionData(this.query).then(res => {
                    this.options_query.limit = res.count;
                    data_versionData(this.options_query).then(res =>{
                        console.log("res",res)
                        for(let item of res.data){
                            this.data_options.push({"id":item.id,"data_version_no":item.data_version_no})          
                        }
                        console.log("data options",this.data_options)
                    })
            })

        },
        // 获取 easy-mock 的模拟数据
        getData() {
            actionData(this.query).then(res => {
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
                    this.action_id.id = this.form.id
                    del_action(this.action_id).then(res =>{
                        if(res.code =='200'){
                            this.$message.success('删除成功');
                            console.log(res)
                            this.getData()
                        }  
                        if(res.code == '201'){
                            this.$message.success(res.err_detail);
                            this.getData()
                        }    
                    // console.log(res.code)
                        // this.rule = res.msg
                        // console.log("del rule",this.rule)
                        // this.getData()
                    });
                    
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
            this.dailogTitleType = "编辑"
            this.action.data_version_id = row.data_version_id
            this.action.project_id = row.project_id
            this.action.rule_id = row.rule_id   
            this.action.data_type = row.data_type,
            this.action.data_version_id = row.data_version_id,
            this.action.send_frequency_min = row.send_frequency_min,
            this.action.send_frequency_max = row.send_frequency_max,
            this.action.data_backup = row.data_backup
            this.action.id = row.id

            console.log("actionid",this.action.id)

            this.idx = index;
            this.form = row;
            this.dialogFormVisible = true;
           
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
            this.dailogTitleType = "新建"
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
        dataFormatter(row,column){
            let dt = row.data_type
            if (dt == 'RANDOM'){
                return '策略随机单据'
            }
            else if (dt == 'FIXED'){
                return '固定单据'
            }
        },
        data_backupFormatter(row,column){
            let dbu = row.data_backup
            if (dbu == 'NO'){
                return '不备份'
            }
            else if (dbu == 'INIT'){
                return '待备份'
            }
            else if (dbu == 'DOING'){
                return '备份中'
            }
            else if (dbu == 'DONE'){
                return '已备份'
            }
        },
        //提交修改和新建的数据
        //通过axios提交到后端
        //双向绑定数据，使填入的input数据进行传输
        submitForm(){
            if(this.subtype == 'creat'){
                console.log("submutForm1",this.data_version)
                subData(this.action).then(res => {
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
                edit_action(this.action).then(res => {
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
