<template>
    <div>
        <div class="container" style="display:flex">
            <div style="display:inline-block;margin-left:10px;width:520px">
                <div>
                    <el-select v-model="branch" @change="getPathTree">
                        <el-option
                            v-for="item in branch_options"
                            :label="item.key"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <el-tree
                    :data="data"
                    show-checkbox
                    :default-expand-all="false"
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                    @node-click="handleCheckChange"
                ></el-tree>
                <div style="margin-left:100px;">
                    <el-button @click="getCheckedNodes" style="">添 加 到 右 侧</el-button>
                    <el-button @click="setCheckedKeys">清空</el-button>
                </div>
            </div>
            <div style="display:inline-block;margin-left:50px;">
                <el-table :data="testPlan.tableData" style="width: 100%" border>
                    <el-table-column prop="label" label="文件名称" width="180" align="center"></el-table-column>
                    <el-table-column prop="filepath" label="文件路径" width="180"></el-table-column>
                    <el-table-column prop="caozuo" label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="float:right">
                    <el-button type="primary" icon="el-icon-check"  round size="medium" @click="addPlan">保存</el-button>
                    <el-button type="danger" icon="el-icon-delete"  round size="medium" @click="cancelData">清空</el-button>
                </div>
                <el-dialog
                    title="subtype"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :modal-append-to-body="false"
                >
                    <el-form ref="testPlan_name" :model="testPlan" label-width="70px">
                        <el-form-item label="测试计划">
                            <el-input v-model="testPlan.testPlan_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitData">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>


<script>
import { pathTree } from '../../api/testcase';
import { get_branchlist } from '../../api/testcase';
import { add_case_test_plan } from '../../api/testcase'
const db = window.localStorage;
export default {
    data() {
        return {
            testPlan: {
                testPlan_name: '',
                tableData: [],
                project_id: ''
            },
            dialogVisible: false,

            branch_options: [],
            branch: '',
            data: [],
            // data :[{'id': 637, 'label': '', 'children': [{'id': 638, 'label': '.gitignore', 'filepath': '../../flaskdemo/gittest/.gitignore'}, {'id': 651, 'label': '14-45-01.html', 'filepath': '../../flaskdemo/gittest/report\\html-report\\wcs_autocase_interface\\2020-01-16\\14-45-01.html'}]}],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    created() {
        this.getData();
    },
    watch: {
        getSearchKey(newVal, oldVal) {
            // console.log("aaaaa111a",newVal,oldVal)
            this.getData(newVal);
        }
    },
    computed: {
        getSearchKey() {
            return this.$store.state.searchKey;
        }
    },
    methods: {
        handleCheckChange(obj){
            console.log(obj)
            let res = this.$refs.tree.getCheckedNodes()
            console.log(res)

        },
        handleDelete(index, row){
            console.log(index,row)
            this.testPlan.tableData.splice(index,1)
            this.$refs.tree.setChecked(row.id,false,false)
        },
        cancelData(){
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(()=>{
                this.testPlan.tableData = []
                this.$refs.tree.setCheckedKeys([])
                }            
            )
            .catch(() => {});

            
        },
        submitData() {
            console.log(this.testPlan);
            add_case_test_plan(this.testPlan).then((res =>{
                console.log(res)
                if(res.code === '200'){
                    this.$message.success(res.message)
                    this.testPlan.tableData = []
                    this.$refs.tree.setCheckedKeys([])
                    this.testPlan.testPlan_name = ''
                }else{
                    this.$message.error(res.message)
                }
                this.dialogVisible = false
            }))

        },
        addPlan() {
            this.dialogVisible = true;
        },
        getData(newVal) {
            this.testPlan.project_id = newVal;
            this.testPlan.tableData = [];
            if (newVal === undefined) {
                this.testPlan.project_id = db.getItem('id');
            }
            get_branchlist().then((res) => {
                this.branch_options = [];
                for (let item of res.data) {
                    this.branch_options.push({
                        value: item,
                        label: item
                    });
                }
                console.log(this.branch_options);
            });
        },
        getPathTree() {
            pathTree(this.branch).then((res) => {
                console.log(res);
                this.data = res;
            });
        },
        getCheckedNodes() {
            console.log(this.$refs.tree.getCheckedNodes());
            let checkNodes = this.$refs.tree.getCheckedNodes();
            this.testPlan.tableData = []
            for (let item of checkNodes) {
                if (item.filepath != undefined) {
                    this.testPlan.tableData.push({
                        id:item.id,
                        filepath: item.filepath,
                        label: item.label
                    });
                }

            }
        },
        setChecked(){
            this.$refs.tree.setChecked(1,true,false)
        },
        getCheckedKeys() {
            console.log(this.$refs.tree.getCheckedKeys());
        },
        setCheckedNodes() {
            this.$refs.tree.setCheckedNodes([
                {
                    id: 5,
                    label: '二级 2-1'
                },
                {
                    id: 9,
                    label: '三级 1-1-1'
                }
            ]);
        },
        setCheckedKeys() {
            this.$refs.tree.setCheckedKeys([1]);
        },
        resetChecked() {
            this.$refs.tree.setCheckedKeys([]);
        }
    }
};
</script>