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
                <el-select v-model="selected_project" placeholder="Select Project" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in project_items"
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
            <el-table :data="tableData" 
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
                <el-table-column prop="bugs" label="bugs" column-key="bugs">
                </el-table-column>
                <el-table-column prop="comment" label="comment" column-key="comment">
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleDetails(scope.$index, scope.row)">Details</el-button>
                        <el-button type="text" icon="el-icon-edit" 
                            :disabled="edit_disabled" 
                            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background 
                    layout="total, sizes, prev, pager, next, jumper" 
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" 
                    :current-page="cur_page" 
                    :page-size="page_size" 
                    :total="total_num">
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
                <el-form-item label="Bugs">
                    <el-input v-model="form.bugs"></el-input>
                </el-form-item>
                <el-form-item label="Comment">
                    <el-input v-model="form.comment" type="textarea"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit"
                    :disabled="edit_disabled" 
                >Submit</el-button>
            </span>
        </el-dialog>

        <!-- 详细信息弹出框 -->
        <el-dialog title="Details" :visible.sync="detailsVisible" width="60%">
            <el-form ref="details" :model="details" label-width="100px">
                <el-form-item label="TestCase id">
                    <el-input v-model="details.case_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="TestRun id">
                    <el-input v-model="details.testrun_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Env">
                    <el-input v-model="details.env" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-input v-model="details.case_result" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Bugs">
                    <el-input v-model="details.bugs" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Comment">
                    <el-input v-model="details.comment" type="textarea" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="stdout">
                    <el-input v-model="details.stdout" type="textarea" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Traceback">
                    <el-input v-model="details.traceback" type="textarea" :disabled="true"></el-input>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchTestResults, updateTestResults, fetchTestrunList, fetchProjectList } from '../../api/data_provider_for_test_result';
    export default {
        name: 'test_result',
        data() {
            return {
                tableData: [],
                testrun_list: [],
                cur_page: 1,
                page_size: 10,
                total_num: 0,
                project_items: [],
                testrun_items: [],
                multipleSelection: [],
                selected_project: '',
                selected_testrun: '',
                inputed_word: '',
                edit_disabled: true,
                editVisible: false,
                detailsVisible: false,
                form: {
                    case_id: '',
                    testrun_id: '',
                    case_result: '',
                    bugs: '',
                    comment: ''
                },
                details: {
                    case_id: '',
                    testrun_id: '',
                    case_result: '',
                    bugs: '',
                    comment: '',
                    env: '',
                    stdout: '',
                    traceback: ''
                }
            }
        },
        watch: {
            "selected_project": function (value) {
                this.selected_testrun = null
                this.getTestrunList()
            },
        },
        created() {
            // this.getData(); # here user did not select project
            // this.getTestrunList()
            this.getProjectList();
            console.log(sessionStorage.getItem('auth.user_role'))
            if(sessionStorage.getItem('auth.user_role')=='viewer'){
                this.edit_disabled = true
            }
            else
                this.edit_disabled = false
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
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
                fetchTestResults(this.selected_project, params).then((res) => {
                    this.tableData = res.data.data;
                    this.total_num = res.data.page_info.total
                    // console.info(this.tableData)
                    // console.info(this.total_num)
                    // this.load_select_items()
                })
            },
            getTestrunList() {
                if(!this.selected_project)
                    return
                var params = {
                    'project_id':this.selected_project,
                    'id_only': 'true'
                }
                fetchTestrunList(this.selected_project, params).then((res) => {
                    var testruns = res.data.data
                    this.testrun_items = new Array()
                    for(var key of testruns){
                        this.testrun_items.push({"key":key, "value":key})
                    }
                })
            },
            getProjectList() {
                fetchProjectList().then((res) => {
                    var indices = res.data.data
                    this.project_items = new Array()
                    for(var key of indices){
                        this.project_items.push({"key":key, "value":key})
                    }
                    // if(this.project_items.length===1){
                    //     this.selected_project = this.project_items[0].value
                    // }
                    if(this.project_items.length > 0){
                        this.selected_project = this.project_items[this.project_items.length-1].value
                        this.getTestrunList()
                    }
                })
            },
            load_select_items() {  //useless for now, this need fetch all data, it's too large
                var testruns = {}
                var components = {}
                this.project_items = new Array()
                this.testrun_items = new Array()
                for(let t of this.tableData) {
                    testruns[t.testrun_id] = t.testrun_id
                    components[t.project_id] = t.project_id
                }
                for(var key in testruns){
                    this.testrun_items.push({"key":key, "value":testruns[key]})
                }
                for(var key in components){
                    this.project_items.push({"key":key, "value":components[key]})
                }
                if(this.project_items.length===1){
                    this.selected_project = this.project_items[0].value
                }
            },
            search() {
                this.cur_page = 1;
                var params = {}
                if(this.selected_project){
                    params["project_id"] = this.selected_project
                }
                if(this.selected_testrun){
                    params["testrun_id"] = this.selected_testrun
                }
                if(this.inputed_word){
                    params["keyword"] = this.inputed_word
                }
                this.getData(params)
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                var params = {}
                params["limit"] = this.page_size
                if(this.cur_page){
                    params["offset"] = (this.cur_page-1) * this.page_size
                }
                if(this.selected_project){
                    params["project_id"] = this.selected_project
                }
                if(this.selected_testrun){
                    params["testrun_id"] = this.selected_testrun
                }
                if(this.inputed_word){
                    params["keyword"] = this.inputed_word
                }
                console.info(params)
                this.getData(params)
            },
            handleSizeChange(val) {
                this.page_size = val;
                var params = {}
                params["limit"] = this.page_size
                if(this.cur_page){
                    params["offset"] = (this.cur_page-1) * this.page_size
                }
                if(this.selected_project){
                    params["project_id"] = this.selected_project
                }
                if(this.selected_testrun){
                    params["testrun_id"] = this.selected_testrun
                }
                if(this.inputed_word){
                    params["keyword"] = this.inputed_word
                }
                console.info(params)
                this.getData(params)
            },
            reload() {
                // this.getData()
                this.selected_project = ""
                this.selected_testrun = ""
                // this.getTestrunList()
                this.getProjectList()
                this.search()
            },
            formatter(row, column) {
                return row.case_result;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            handleEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.editVisible = true;
            },
            handleDetails(index, row) {
                // this.form = JSON.parse(JSON.stringify(row))
                var params = {}
                if(this.selected_project){
                    params["project_id"] = this.selected_project
                }
                params["testrun_id"] = row['testrun_id']
                params["case_id"] = row['case_id']
                params["details"] = true
                fetchTestResults(this.selected_project, params).then((res) => {
                    this.details = res.data.data[0];
                })
                this.detailsVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                updateTestResults(this.selected_project, this.form).then((res) => {
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
                }).catch(function (error) {
                    console.error(error)
                    if (error.response) {
                        if (error.response.data.error)
                            alert(error.response.data.error)
                        else
                            alert(error.response.data)
                    }
                    else{
                        alert(error.message)
                    }
                });
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
