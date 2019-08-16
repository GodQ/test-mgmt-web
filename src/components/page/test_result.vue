<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Test Result</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">Batch Delete</el-button>
                <el-select v-model="select_component" placeholder="Select Component" class="handle-select mr10">
                    <el-option key="1" label="godq" value="godq"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="search keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">Search</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="testrun_id" label="TestRun id" sortable>
                </el-table-column>
                <el-table-column prop="case_name" label="TestCase" sortable>
                </el-table-column>
                <el-table-column prop="case_result" label="Status" sortable>
                </el-table-column>
                <el-table-column prop="comment" label="Comment">
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size=8 layout="prev, pager, next" :total="100">
                </el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="Edit" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="TestCase id">
                    <el-input v-model="form.case_id"></el-input>
                </el-form-item>
                <el-form-item label="TestCase Name">
                    <el-input v-model="form.case_name"></el-input>
                </el-form-item>
                <el-form-item label="Test Run id">
                    <el-input v-model="form.testrun_id"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-input v-model="form.case_result"></el-input>
                </el-form-item>
                <el-form-item label="comment">
                    <el-input v-model="form.comment"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit">Submit</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="Alert" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">Delete?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">Cancel</el-button>
                <el-button type="primary" @click="deleteRow">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData } from '../../api/data_provider';
    export default {
        name: 'test_result',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_component: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    case_id: '',
                    case_name: '',
                    testrun_id: '',
                    case_result: '',
                    comment: ''
                },
                idx: -1,
                id: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    console.log(d.testrun_id)
                    if (!is_del) {
                        if (
                            (this.select_component==='' || d.index===this.select_component) &&
                            (d.case_name.indexOf(this.select_word) > -1 ||
                                d.testrun_id.toString().indexOf(this.select_word) > -1 ||
                                d.case_result.toString().indexOf(this.select_word)>-1 )
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 test result 数据
            getData() {
                fetchData({
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.case_result;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                this.form = {
                    case_id: row.case_id,
                    case_name: row.case_name,
                    testrun_id: row.testrun_id,
                    case_result: row.case_result,
                    comment: row.comment
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].case_id + ' ';
                }
                this.$message.error("Deleted " + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$message.success(`Edit line ${this.idx+1} successfully`);
                if(this.tableData[this.idx].id === this.id){
                    this.$set(this.tableData, this.idx, this.form);
                }else{
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].id === this.id){
                            this.$set(this.tableData, i, this.form);
                            return ;
                        }
                    }
                }
            },
            // 确定删除
            deleteRow(){
                this.$message.success('Deleted');
                this.delVisible = false;
                if(this.tableData[this.idx].id === this.id){
                    this.tableData.splice(this.idx, 1);
                }else{
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].id === this.id){
                            this.tableData.splice(i, 1);
                            return ;
                        }
                    }
                }
            }
        }
    }

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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
