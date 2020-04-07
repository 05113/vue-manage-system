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
                    <i class="el-icon-lx-cascades"></i> 项目列表
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
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 新增弹出界面 -->
            <div class="handle-box">
　              <el-button type="primary" size="medium" @click="addProject">新增</el-button>
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
                <el-table-column prop="id" label="项目id" width="55" align="center"></el-table-column>
                <el-table-column prop="project_name" label="项目名称"></el-table-column>
                <el-table-column prop="db_port" label="数据库主机"></el-table-column>
                <el-table-column prop="server_host" label="服务器主机"></el-table-column>
                <el-table-column prop="docker_domain" label="docker域名"></el-table-column>
                <el-table-column prop="rcs_api_domain" label="rcsAPI域名"></el-table-column>
                <!-- <el-table-column label="账户余额">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column> -->
                <!-- <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column> -->

                <!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
                <el-table-column label="操作" width="550" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑项目</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleDelete(scope.$index, scope.row)"
                        >固定单据策略</el-button>
                            <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >单据数据</el-button>
                            <el-button
                            type="text"
                            icon="el-icon-video-play"
                            @click="handleEdit(scope.$index, scope.row)"
                        >测试执行</el-button>
                            <el-button
                            type="text"
                            icon="el-icon-copy-document"
                            @click="handleEdit(scope.$index, scope.row)"
                        >数据备份</el-button>
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
        <el-dialog title="新建" :visible.sync="dialogFormVisible" width="50%">
            <el-form ref="form" :model="project" label-width="100px">
                    
                        <el-form-item label="项目名称" prop="project_name">
                        <el-input v-model="project.project_name"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="owner" prop="owner">
                        <el-input v-model="project.owner"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="仓库id" prop="warehouse_id">
                        <el-input v-model="project.warehouse_id"></el-input>
                        </el-form-item>
                    
                
                
                       
                        <el-form-item label="数据库主机" prop="db_host">
                        <el-input v-model="project.db_host"></el-input>
                        </el-form-item>
                    
                     
                        <el-form-item label="数据库端口" prop="db_port">
                        <el-input v-model="project.db_port"></el-input>
                        </el-form-item> 
                    
                     
                        <el-form-item label="数据库用户名" prop="db_user">
                        <el-input v-model="project.db_user"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="数据库密码" prop="db_pwd">
                        <el-input v-model="project.db_pwd"></el-input>
                        </el-form-item>
                    
                
               
                    
                        <el-form-item label="服务器主机" prop="server_host">
                        <el-input v-model="project.server_host"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="服务器端口" prop="server_port">
                        <el-input v-model="project.server_port"></el-input>
                        </el-form-item>
                   
                   
                        <el-form-item label="服务器用户名" prop="server_user">
                        <el-input v-model="project.server_user"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="服务器密码" prop="server_pwd">
                        <el-input v-model="project.server_pwd"></el-input>
                        </el-form-item>
                    
                
                
                    
                        <el-form-item label="docker域名" prop="docker_domain">
                        <el-input v-model="project.docker_domain"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="rcsAPI域名" prop="rcs_api_domain">
                        <el-input v-model="project.rcs_api_domain"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="station域名" prop="station_domain">
                        <el-input v-model="project.station_domain"></el-input>
                        </el-form-item>
                    
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
            <!-- 编辑弹出编辑框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="project" label-width="100px">
                
                        <el-form-item label="项目名称" prop="project_name">
                        <el-input v-model="project.project_name"></el-input>
                        </el-form-item>

                        <el-form-item label="owner" prop="owner">
                        <el-input v-model="project.owner"></el-input>
                        </el-form-item>
          
                        <el-form-item label="仓库id" prop="warehouse_id">
                        <el-input v-model="project.warehouse_id"></el-input>
                        </el-form-item>
                    
               
                        <el-form-item label="数据库主机" prop="db_host">
                        <el-input v-model="project.db_host"></el-input>
                        </el-form-item>
                   
                        <el-form-item label="数据库端口" prop="db_port">
                        <el-input v-model="project.db_port"></el-input>
                        </el-form-item> 
                     
                        <el-form-item label="数据库用户名" prop="db_user">
                        <el-input v-model="project.db_user"></el-input>
                        </el-form-item>
                    
                        <el-form-item label="数据库密码" prop="db_pwd">
                        <el-input v-model="project.db_pwd"></el-input>
                        </el-form-item>
                    
            
                    
                        <el-form-item label="服务器主机" prop="server_host">
                        <el-input v-model="project.server_host"></el-input>
                        </el-form-item>
                    
                   
                        <el-form-item label="服务器端口" prop="server_port">
                        <el-input v-model="project.server_port"></el-input>
                        </el-form-item>
                    
                    
                        <el-form-item label="服务器用户名" prop="server_user">
                        <el-input v-model="project.server_user"></el-input>
                        </el-form-item>
                   
                        <el-form-item label="服务器密码" prop="server_pwd">
                        <el-input v-model="project.server_pwd"></el-input>
                        </el-form-item>
                   
               
                        <el-form-item label="docker域名" prop="docker_domain">
                        <el-input v-model="project.docker_domain"></el-input>
                        </el-form-item>
                   
                        <el-form-item label="rcsAPI域名" prop="rcs_api_domain">
                        <el-input v-model="project.rcs_api_domain"></el-input>
                        </el-form-item>
                    
                        <el-form-item label="station域名" prop="station_domain">
                        <el-input v-model="project.station_domain"></el-input>
                        </el-form-item>
                    
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmitForm">确 定</el-button>
            </span>
        </el-dialog> 
    </div>
</template>

<script>
//引用此文件目录的方法
import { fetchData } from '../../api/index';
import { subData } from '../../api/index';
import {getDataById} from '../../api/index';
import {edit_project} from '../../api/index';
import {del_project} from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                // address: '',原模板未注释
                // name: '',原模板未注释
                page: 1,
                limit: 2
            },
            project:{
                    project_name:"",
                    db_host:"",
                    db_port:"",
                    db_user:"",
                    db_pwd:"",
                    server_host:"",
                    server_port:"",
                    server_user:"",
                    server_pwd:"",
                    docker_domain:"",
                    rcs_api_domain:"",
                    station_domain:"",
                    warehouse_id:"",
                    owner:""              
            },
            project_id:{
                id:""
            },
            tableData: [],
            multipleSelection: [],
            dialogFormVisible: false,
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id1: -1,
            dailogTitleType:"",
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res.data);
                this.tableData = res.data;
                console.log('getData()',this.tableData)
                this.pageTotal = res.count || 50;
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
                    this.project_id.id = this.form.id
                    console.log("del:",this.project_id)
                    del_project(this.project_id).then(res =>{
                    // console.log(res.code)
                    // this.project = res.msg
                    // console.log("del project",this.project)
                    this.getData()
            });
                    this.$message.success('删除成功');
                    //eltable减少一行
                    // this.tableData.splice(index, 1);
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
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.project_id.id = this.form.id
            // console.log("projectId",this.project_id.id)
            getDataById(this.project_id).then(res =>{
                // console.log(res.code)
                this.project = res.msg[0]
                console.log("project",this.project)
            });
            // const _selectData = this.$refs.itsmDataTable.selection
        },
        
        //新建操作,弹出对话框
        // 首先定义dialogFormVisible为false，通过事件触发方法改为true
        addProject(){
            // 对话框显示
            this.dialogFormVisible = true;
            this.dialogStatus = "addProject";
            // 重置input内容$refs.form 中的form根据el-form中获取
            //<el-form ref="form" :model="project" label-width="70px">
            this.$refs.form.resetFields()

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
        this.$message.error(errdetail);
        },
        //提交project
        //通过axios提交到后端
        //双向绑定数据，使填入的input数据进行传输
        submitForm(){
             subData(this.project).then(res => {
                if(res.code == '201'){
                    this.open("检查参数"+res.msg)
                }
                   if(res.code =='200'){
                    this.dialogFormVisible = false
                    this.$message.success(`添加成功`);
                    this.getData()
                }
            }).catch();
             this.dialogFormVisible = false
             this.getData()
        },
        editSubmitForm(){     
            edit_project(this.project).then(res => {
                if(res.code == '201'){
                    this.open(res.err_detail)
                }
                if(res.code =='200'){
                    this.editVisible = false
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.getData()
                }
            }).catch();
            // this.$set(this.tableData, this.idx, this.form);
            //调用请求异步调用 如果getData放在外面  会控制不住请求顺序 this.getData()  放开后会在editoptions后发送个请求，但response得到的内容还是之前的请求内容，然后在发送个editPost请求
        }

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
