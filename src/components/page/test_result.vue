<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Test Result</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-refresh" @click="reload">Reload</el-button> 
                <el-select v-model="select_component" placeholder="Select Component" class="handle-select mr10">
                    <el-option key="1" label="godq" value="godq"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="search keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">Search</el-button>
            </div>
            <el-table :data="view_data.slice((cur_page-1) * page_size, cur_page * page_size)" 
              border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
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
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" 
                    :page-size="page_size" layout="prev, pager, next" :total="view_num">
                </el-pagination>
            </div>
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
    </div>
</template>

<script>
    import { fetchData, updateData } from '../../api/data_provider';
    export default {
        name: 'test_result',
        data() {
            return {
                tableData: [],
                view_data: [],
                cur_page: 1,
                page_size: 5,
                total_num: 0,
                view_num: 0,
                multipleSelection: [],
                select_component: '',
                select_word: '',
                editVisible: false,
                form: {
                    case_id: '',
                    case_name: '',
                    testrun_id: '',
                    case_result: '',
                    comment: ''
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.view_data
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
            },
            // 获取 test result 数据
            getData() {
                fetchData({page: this.cur_page}).then((res) => {
                    this.tableData = res.data.data;
                    this.total_num = this.tableData.length
                    this.view_data = this.tableData
                    this.view_num = this.total_num
                })
            },
            search() {
                this.view_data = this.tableData.filter((d) => {
                    console.log(this.select_word)
                    if (
                        (this.select_component==='' || d.index===this.select_component) &&
                        (d.case_name.indexOf(this.select_word) > -1 ||
                            d.testrun_id.toString().indexOf(this.select_word) > -1 ||
                            d.case_result.toString().indexOf(this.select_word)>-1 )
                    ) {
                        return d;
                    }
                })
                this.view_num = this.view_data.length
            },
            reload() {
                this.getData()
            },
            formatter(row, column) {
                return row.case_result;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                // this.form = {
                //     case_id: row.case_id,
                //     case_name: row.case_name,
                //     testrun_id: row.testrun_id,
                //     case_result: row.case_result,
                //     comment: row.comment
                // }
                this.form = JSON.parse(JSON.stringify(row))
                this.editVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                updateData(this.form).then((res) => {
                    console.log(res)
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].case_id === this.form.case_id &&
                            this.tableData[i].testrun_id === this.form.testrun_id){
                            this.$set(this.tableData, i, this.form);
                            break ;
                        }
                    }
                    for(let i = 0; i < this.view_data.length; i++){
                        if(this.view_data[i].case_id === this.form.case_id &&
                            this.view_data[i].testrun_id === this.form.testrun_id){
                            this.$set(this.view_data, i, this.form);
                            break ;
                        }
                    }
                    this.$message.success(`Save successfully`);
                }).catch((e) => {});
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 180px;
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
