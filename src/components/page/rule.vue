<template>
    <div>
        <div class="crumbs">
            <!-- 基础表格 -->
            <el-breadcrumb separator="/">
                <!-- 点击每级都可以进行跳转  一级->二级->三级 -->
                <!-- <el-breadcrumb-item :to="{paht:'/'}">
                    <i class="el-icon-lx-cascades"></i> 首页
                </el-breadcrumb-item> -->
<!--                <el-breadcrumb-item>-->
<!--                    <i class="el-icon-lx-cascades"></i> 单据策略-->
<!--                </el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
<!--                <el-button-->
<!--                    type="primary"-->
<!--                    icon="el-icon-delete"-->
<!--                    class="handle-del mr10"-->
<!--                    @click="delAllSelection"-->
<!--                >批量删除</el-button>-->
<!--                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
<!--                    <el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--                    <el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--                </el-select>-->
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 新增弹出界面 -->
            <div class="handle-box">
　              <el-button type="primary" size="medium" @click="addRule(form)">新建拣货策略</el-button>
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
<!--                <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="策略ID" align="center"></el-table-column>
                <el-table-column prop="rule_name" label="策略名"></el-table-column>
                <el-table-column prop="rule_type" label="测试场景"></el-table-column>
                <el-table-column prop="send_batch_num" label="发送批次"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
        <el-dialog title="dailogTitleType" :visible.sync="dialogFormVisible" width="30%">
            <el-form ref="form" :model="rule" :inline="true" label-width="120px">

                <el-row :gutter="3" >
                    <el-form-item label="策略名" prop="rule_name">
                        <el-input v-model="rule.rule_name"></el-input>
                    </el-form-item>
                </el-row>
                <el-row :gutter="3" >
                    <el-form-item label="发送批次数" prop="send_batch_num">
                        <el-input v-model="rule.send_batch_num"></el-input>
                    </el-form-item>
                </el-row>

                <el-row :gutter="3" >
                    <el-form-item label="owner" prop="owner">
                        <el-input v-model="rule.owner"></el-input>
                    </el-form-item>
                </el-row>
                    <!-- 是否是集合单 -->
                <el-row :gutter="3" >
                    <el-form-item label="是否集合单" prop="rule_detail.is_group">
                    <el-radio v-model="rule.rule_detail.is_group" :label=false>否</el-radio>
                    <el-radio v-model="rule.rule_detail.is_group" :label=true>是</el-radio>
                    </el-form-item>
                </el-row>
                <el-row :gutter="3" >
                    <el-form-item label="集合单数量区间" prop="rule_detail.group_num_min">
                    <el-input v-model="rule.rule_detail.group_num_min" style="width: 85px"></el-input>
                    </el-form-item>到
                    <el-form-item  prop="rule_detail.group_num_max">
                    <el-input v-model="rule.rule_detail.group_num_max" style="width: 85px"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="出库单数量区间" prop="rule_detail.picking_num_min">
                    <el-input v-model="rule.rule_detail.picking_num_min" style="width: 85px"></el-input>
                    </el-form-item>到
                    <el-form-item  prop="rule_detail.picking_num_max">
                    <el-input v-model="rule.rule_detail.picking_num_max" style="width: 85px"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="货品数量区间" prop="rule_detail.picking_detail_num_min">
                    <el-input v-model="rule.rule_detail.picking_detail_num_min" style="width: 85px"></el-input>
                    </el-form-item>到
                    <el-form-item  prop="rule_detail.picking_detail_num_max">
                    <el-input v-model="rule.rule_detail.picking_detail_num_max" style="width: 85px"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="货品件数区间" prop="rule_detail.sku_num_min">
                    <el-input v-model="rule.rule_detail.sku_num_min" style="width: 85px"></el-input>
                    </el-form-item>到
                    <el-form-item  prop="rule_detail.sku_num_max">
                    <el-input v-model="rule.rule_detail.sku_num_max" style="width: 85px"></el-input>
                    </el-form-item>
                </el-row>
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
import { ruleData } from '../../api/rule';
import { subData } from '../../api/rule';
import {getDataById} from '../../api/rule';
import {edit_rule} from '../../api/rule';
import {del_rule} from '../../api/rule';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                page: 1,
                limit: 2
            },
            rule:{
                    rule_name:"",
                    send_batch_num:"",
                    rule_type:"",
                    rule_detail: {
                        is_group:"",
                        group_num_min:"",
                        group_num_max:"",
                        picking_num_min:"",
                        picking_num_max:"",
                        picking_detail_num_min:"",
                        picking_detail_num_max:"",
                        sku_num_min:"",
                        sku_num_max:"",
                    },
                    owner:""
            },
            rule_id:{
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
            id: -1,
            subtype: "",
            dailogTitleType:""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            ruleData(this.query).then(res => {
                console.log("res",res);
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
                    this.rule_id.id = this.form.id
                    del_rule(this.rule_id).then(res =>{
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
            this.dailogTitleType = "编辑"
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
                    this.$refs.form.resetFields();
                    }
                })
            },

        //新建操作,弹出对话框
        // 首先定义dialogFormVisible为false，通过事件触发方法改为true
        addRule(form){
            // 对话框显示
            this.subtype = "creat"
            this.dialogFormVisible = true;
            this.rule.rule_type = "1";//1代表拣货策略
            this.dailogTitleType = "创建"
            // this.dialogStatus = "addProject";
            // 重置input内容$refs.form 中的form根据el-form中获取
            //<el-form ref="form" :model="project" label-width="70px">
            // this.$refs.form.resetFields()
            this.resetForm(this.form)

        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
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
                console.log("submutForm1",this.rule)
                subData(this.rule).then(res => {
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
