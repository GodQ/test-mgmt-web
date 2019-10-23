<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Test Result</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                Component:
                <el-select v-model="selected_index" placeholder="Select Component" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in index_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                TestRun:
                <el-select v-model="selected_testrun" placeholder="Select TestRun" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in testrun_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                Keyword:
                <el-input v-model="inputed_word" placeholder="search keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">Search</el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="reload">Reload</el-button> 
            </div>
            <el-table :data="tableData.slice((cur_page-1) * page_size, cur_page * page_size)" 
              border class="table" ref="multipleTable" 
                @selection-change="handleSelectionChange" 
                @filter-change="handleFilterChange">
                <el-table-column type="selection" width="55" column-key="selection" align="center"></el-table-column>
                <el-table-column prop="testrun_id" label="testrun_id" column-key="testrun_id" sortable>
                </el-table-column>
                <el-table-column prop="case_id" label="case_id" column-key="case_id" sortable>
                </el-table-column>
                <el-table-column prop="case_result" label="case_result" column-key="case_result" sortable>
                </el-table-column>
                <el-table-column prop="comment" label="comment" column-key="comment">
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" 
                    :page-size="page_size" layout="prev, pager, next" :total="total_num">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="Edit" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="TestCase id">
                    <el-input v-model="form.case_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="TestRun id">
                    <el-input v-model="form.testrun_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-input v-model="form.case_result" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="comment">
                    <el-input v-model="form.comment" type="textarea"></el-input>
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
    import { fetchData, updateData, fetchTestrunList, fetchIndexList } from '../../api/data_provider';
    export default {
        name: 'test_result',
        data() {
            return {
                tableData: [],
                testrun_list: [],
                cur_page: 1,
                page_size: 10,
                total_num: 0,
                index_items: [],
                testrun_items: [],
                multipleSelection: [],
                selected_index: '',
                selected_testrun: '',
                inputed_word: '',
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
            this.getTestrunList()
            this.getIndexList()
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
            },
            handleFilterChange(filters) {
                console.log('筛选条件发生变化')
                console.log(filters)
                let row = null
                let val = null
                // 拷贝filters的值。
                for (const i in filters) {
                    row = i // 保存 column-key的值，如果事先没有为column-key赋值，系统会自动生成一个唯一且恒定的名称
                    val = filters[i]
                }
                const filter = [{
                    row: row,
                    op: 'contains',
                    value: val
                }]
                console.log(filter)
            },
            // 获取 test result 数据
            getData(params) {
                fetchData(params).then((res) => {
                    this.tableData = res.data.data;
                    this.total_num = this.tableData.length
                    // this.load_select_items()
                })
            },
            getTestrunList() {
                fetchTestrunList().then((res) => {
                    var testruns = res.data.data
                    this.testrun_items = new Array()
                    for(var key of testruns){
                        this.testrun_items.push({"key":key, "value":key})
                    }
                })
            },
            getIndexList() {
                fetchIndexList().then((res) => {
                    var indices = res.data.data
                    this.index_items = new Array()
                    for(var key of indices){
                        this.index_items.push({"key":key, "value":key})
                    }
                    if(this.index_items.length===1){
                        this.selected_index = this.index_items[0].value
                    }
                })
            },
            load_select_items() {  //useless for now, this need fetch all data, it's too large
                var testruns = {}
                var components = {}
                this.index_items = new Array()
                this.testrun_items = new Array()
                for(let t of this.tableData) {
                    testruns[t.testrun_id] = t.testrun_id
                    components[t.index] = t.index
                }
                for(var key in testruns){
                    this.testrun_items.push({"key":key, "value":testruns[key]})
                }
                for(var key in components){
                    this.index_items.push({"key":key, "value":components[key]})
                }
                if(this.index_items.length===1){
                    this.selected_index = this.index_items[0].value
                }
            },
            search() {
                var params = {}
                if(this.selected_index){
                    params["index"] = this.selected_index
                }
                if(this.selected_testrun){
                    params["testrun_id"] = this.selected_testrun
                }
                if(this.inputed_word){
                    params["keyword"] = this.inputed_word
                }
                this.getData(params)
            },
            reload() {
                this.getData()
                this.selected_index = ""
                this.selected_testrun = ""
                this.getTestrunList()
                this.getIndexList()
            },
            formatter(row, column) {
                return row.case_result;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
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
                    // console.log(res)
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].case_id === this.form.case_id &&
                            this.tableData[i].testrun_id === this.form.testrun_id){
                            this.$set(this.tableData, i, this.form);
                            break ;
                        }
                    }
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].case_id === this.form.case_id &&
                            this.tableData[i].testrun_id === this.form.testrun_id){
                            this.$set(this.tableData, i, this.form);
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
