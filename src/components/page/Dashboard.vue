<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{user_name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <!-- <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div> -->
                    <!-- <div class="user-info-list">上次登录地点：<span>东莞</span></div> -->
                </el-card>
                <!-- <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>
                    Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>
                    JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    CSS
                    <el-progress :percentage="3.7"></el-progress>
                    HTML
                    <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
                </el-card> -->
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{project_count}}</div>
                                    <div>Projects</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{testrun_count}}</div>
                                    <div>Test Runs</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{total}}</div>
                                    <div>Test Results</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div>
        Select Project:
                <el-select v-model="selected_project" placeholder="Select Project" class="handle-select mr10">
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

            <el-row :gutter="20">
                <el-col :span="20">
                    <el-card shadow="hover">
                        <schart ref="bar" class="schart" canvasId="bar" :data="success_rate_chart_data" type="bar" :options="options"></schart>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-card shadow="hover">
                        <schart ref="line" class="schart" canvasId="line" :data="success_rate_chart_data" type="line" :options="options2"></schart>
                    </el-card>
                </el-col>
            </el-row>
            <el-table :data="testruns" 
              border class="table" >
                <el-table-column prop="testrun_id" label="testrun" column-key="testrun_id" >
                </el-table-column>
                <el-table-column prop="suite_name" label="suite" column-key="suite_name" >
                </el-table-column>
                <el-table-column prop="env" label="env" column-key="env" >
                </el-table-column>
                <el-table-column prop="case_count" label="case_count" column-key="case_count" >
                </el-table-column>
                <el-table-column prop="success_rate" label="success_rate(%)" column-key="success_rate" >
                </el-table-column>
                <el-table-column prop="success" label="success" column-key="success" >
                </el-table-column>
                <el-table-column prop="failure" label="failure" column-key="failure" >
                </el-table-column>
                <el-table-column prop="error" label="error" column-key="error" >
                </el-table-column>
                <el-table-column prop="skip" label="skip" column-key="skip" >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import { 
        fetchSummary, 
        fetchProjectList, 
        fetchTestrunList, 
        fetchProjectSettings 
    } from '../../api/data_provider_for_test_result';
    export default {
        name: 'dashboard',
        data() {
            return {
                user_name: sessionStorage.getItem('auth.user_name'),
                user_role: sessionStorage.getItem('auth.user_role'),
                total: null,
                project_count: null,
                testrun_count: null,
                testruns: [],
                project_items: [],
                selected_project: '',
                project_suites: ['all'],
                selected_suite: '',
                project_envs: ['all'],
                selected_env: '',
                success_rate_chart_data: [
                    // {
                    //     name: '2018/09/04',
                    //     value: 1083
                    // },
                    // {
                    //     name: '2018/09/05',
                    //     value: 941
                    // }
                ],
                options: {
                    title: 'Success Rate',
                    showValue: true,
                    fillColor: 'rgb(45, 140, 240)',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                },
                options2: {
                    title: 'Success Rate Trend',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                if (this.user_role === 'admin')
                    return 'Administrator'
                else if (this.user_role === 'developer')
                    return 'QE && Developer'
                else if (this.user_role === 'viewer')
                    return 'Viewer'
                else 
                    return "Unknown User"
            }
        },
        watch: {
            "selected_project": function (value) {
                this.getProjectSettings()
                this.getTestrunList()
            },
            "selected_env": function (value) {
                this.getTestrunList()
            },
            "selected_suite": function (value) {
                this.getTestrunList()
            },
        },
        created(){
            if(sessionStorage.getItem('auth.user_name')==null){
                this.$router.push('/login');
            }

            this.handleListener();
            this.get_summary();
            this.getProjectList();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            get_summary(){
                fetchSummary().then((res) => {
                    console.log(res.data)
                    this.total = res.data.total;
                    this.project_count = res.data.project_count;
                    this.testrun_count = res.data.testrun_count;
                })
            },
            getProjectList() {
                fetchProjectList({"id_only": "true"}).then((res) => {
                    var indices = res.data.data
                    this.project_items = new Array()
                    for(var key of indices){
                        this.project_items.push({"key":key, "value":key})
                    }
                    if(this.project_items.length > 0){
                        this.selected_project = this.project_items[0].value
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
            getTestrunList(source) {
                if(!this.selected_project)
                    return
                var params = {
                    'project':this.selected_project,
                    'env':this.selected_env,
                    'suite':this.selected_suite,
                    'id_only': 'false',
                    'limit': 10
                }
                fetchTestrunList(this.selected_project, params).then((res) => {
                    var testruns = res.data.data
                    if(testruns.length > 0){
                        this.testruns = testruns
                        this.success_rate_chart_data = new Array()
                        for(var testrun of testruns){
                            this.success_rate_chart_data.push(
                                {"name":testrun['testrun_id'], "value":testrun['success_rate']})
                        }
                        this.success_rate_chart_data.reverse()
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
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
