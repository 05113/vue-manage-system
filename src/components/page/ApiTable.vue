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
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="api_name" label="接口名称"></el-table-column>
                <el-table-column prop="api_url" label="接口url"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
                        >删除1</el-button>
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
            <el-form ref="api_entity" :model="api_entity" label-width="70px">
                <el-form-item label="接口名称">
                    <el-input v-model="api_entity.api_name"></el-input>
                </el-form-item>
                <el-form-item label="接口url">
                    <el-input v-model="api_entity.api_url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get_api_list } from '../../api/api';
import { delete_api } from '../../api/api';
import { update_api } from '../../api/api';
import { create_api } from '../../api/api';
import Base from '../common/Header'
const db = window.localStorage

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                page: 1,
                limit: 10
            },
            subtype:"",
            url:Base.baseURL,
            queryName:"",
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            api_entity: {
                id:"",
                api_name:"",
                api_url:""
            },
            idx: -1,
            id: -1,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            get_api_list(this.query).then(res => {
                console.log(res);
                this.tableData = res.data;
                this.pageTotal = res.count || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
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
        // 编辑操作
        handleEdit(index, row) {
            this.subtype = 'edit'
            this.idx = index;
            this.api_entity = row;
            this.editVisible = true;
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
