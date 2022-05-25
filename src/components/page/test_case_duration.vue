<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Test Result</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                Project:
                <el-select v-model="selected_project" placeholder="Select Project" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in project_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                Test Suite:
                <el-select v-model="selected_suite" placeholder="Select Test Suite" class="handle-select mr10">
                    <el-option
                        v-for="item in project_suites"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                Test Environment:
                <el-select v-model="selected_env" placeholder="Select Test Environment" class="handle-select mr10">
                    <el-option
                        v-for="item in project_envs"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-checkbox v-model="order_by_duration">Order by duration</el-checkbox>
            </div>

            <div class="handle-box">
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
                Results:
                <el-select v-model="case_result_list" multiple placeholder="Test Results">
                    <el-option
                    v-for="item in case_result_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search">Search</el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="reload">Reload</el-button> 
            </div>

            <el-row :gutter="20">
                <el-col :span="20">
                    <el-card shadow="hover">
                        <schart ref="bar" class="schart" canvasId="bar" :data="durations_data" type="bar" :options="durations_options"></schart>
                    </el-card>
                </el-col>
            </el-row>

            <el-table :data="tableData" 
              border class="table" ref="multipleTable" 
                @selection-change="handleSelectionChange" 
                @filter-change="handleFilterChange">
                <el-table-column type="selection" width="55" column-key="selection" align="center"></el-table-column>
                <el-table-column prop="testrun_id" label="testrun_id" column-key="testrun_id">
                </el-table-column>
                <el-table-column prop="module" label="module" column-key="module">
                </el-table-column>
                </el-table-column>
                <el-table-column prop="case" label="case" column-key="case">
                </el-table-column>
                <el-table-column prop="case_result" label="case_result" column-key="case_result">
                </el-table-column>
                <el-table-column prop="duration" label="duration" column-key="duration">
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
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import { 
        fetchTestResults, 
        fetchTestrunList, 
        fetchProjectList, 
        fetchProjectSettings 
    } from '../../api/data_provider_for_test_result';
    export default {
        name: 'test_result',
        data() {
            return {
                tableData: [],
                durations_data: [],
                durations_options: {
                    title: 'Test Case Durations/s',
                    showValue: true,
                    fillColor: 'rgb(45, 140, 240)',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                },
                testrun_list: [],
                cur_page: 1,
                page_size: 10,
                total_num: 0,
                project_items: [],
                testrun_items: [],
                project_suites: ['all'],
                selected_suite: '',
                project_envs: ['all'],
                selected_env: '',
                order_by_duration: true,
                multipleSelection: [],
                selected_project: '',
                selected_testrun: '',
                case_result_options: [
                    {value: 'success', label: 'success'},
                    {value: 'error', label: 'error'},
                    {value: 'failure', label: 'failure'},
                    {value: 'skip', label: 'skip'},
                ],
                case_result_list: [],
                inputed_word: '',
            }
        },
        watch: {
            "selected_project": function (value) {
                this.selected_testrun = null
                this.getTestrunList('project')
                this.getProjectSettings()
            },
            "selected_env": function (value) {
                this.selected_testrun = null
                this.getTestrunList('env')
            },
            "selected_suite": function (value) {
                this.selected_testrun = null
                this.getTestrunList('suite')
            },
        },
        created() {
            // this.getTestResults(); # here user did not select project
            // this.getTestrunList()
            this.getProjectList();
            console.log(sessionStorage.getItem('auth.user_role'))
        },
        components: {
            Schart
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
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
            getTestResults(params) {
                fetchTestResults(this.selected_project, params).then((res) => {
                    this.tableData = res.data.data;
                    this.total_num = res.data.page_info.total;
                    this.durations_data = new Array()

                    for (let i = 0; i < this.tableData.length; i++) {
                        var t = this.tableData[i];
                        var case_id = t['case_id'];
                        var index = case_id.lastIndexOf(".");
                        t['module'] = case_id.substring(0, index);
                        t['case'] = case_id.substring(index+1, case_id.length);

                        this.durations_data.push(
                                {"name":case_id, "value":t['duration'].toFixed(2)})
                    }
                    // console.info(this.tableData)
                    // console.info(this.total_num)
                    // this.load_select_items()
                })
            },
            getTestrunList(source) {
                if(!this.selected_project)
                    return
                var params = {
                    'project_id':this.selected_project,
                    'env':this.selected_env,
                    'suite':this.selected_suite,
                    'id_only': 'true'
                }
                fetchTestrunList(this.selected_project, params).then((res) => {
                    var testruns = res.data.data
                    if(testruns.length > 0){
                        this.testrun_items = new Array()
                        for(var key of testruns){
                            this.testrun_items.push({"key":key, "value":key})
                        }
                    }else{
                        alert('There is no testrun matched ')
                        console.warn('There is no testrun matched for '+ JSON.stringify(params))
                        if(source=='env')
                            this.selected_env = null
                        else if(source=='suite')
                            this.selected_suite = null
                    }
                })
            },
            getProjectList() {
                fetchProjectList({"id_only": "true"}).then((res) => {
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
            getProjectSettings() {
                fetchProjectSettings(this.selected_project).then((res) => {
                    var envs = res.data.data.envs
                    var suites = res.data.data.suites
                    this.project_envs = new Array()
                    this.project_envs.push('all')
                    for(var key of envs){
                        this.project_envs.push(key)
                    }
                    this.project_suites = new Array()
                    this.project_suites.push('all')
                    for(var key of suites){
                        this.project_suites.push(key)
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
            get_search_params() {
                var params  = {}
                if(this.selected_project){
                    params["project_id"] = this.selected_project
                }
                if(this.selected_testrun){
                    params["testrun_id"] = this.selected_testrun
                }
                if(this.inputed_word){
                    params["keyword"] = this.inputed_word
                }
                if(this.case_result_list){
                    params["case_result"] = this.case_result_list.join(',')
                }
                if(this.order_by_duration){
                    params["desc"] = 'duration'
                }
                return params;
            },
            search() {
                this.cur_page = 1;
                var params = this.get_search_params()
                this.getTestResults(params)
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                var params = this.get_search_params()
                params["limit"] = this.page_size
                if(this.cur_page){
                    params["offset"] = (this.cur_page-1) * this.page_size
                }
                console.info(params)
                this.getTestResults(params)
            },
            handleSizeChange(val) {
                this.page_size = val;
                var params = this.get_search_params()
                params["limit"] = this.page_size
                if(this.cur_page){
                    params["offset"] = (this.cur_page-1) * this.page_size
                }
                console.info(params)
                this.getTestResults(params)
            },
            reload() {
                // this.getTestResults()
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
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
