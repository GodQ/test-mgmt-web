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
                <el-select v-model="select_component" placeholder="Select Component" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in component_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                TestRun:
                <el-select v-model="select_testrun" placeholder="Select TestRun" class="handle-select mr10">
                    <!-- <el-option key="1" label="godq" value="godq"></el-option> -->
                    <el-option
                        v-for="item in testrun_items"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
                Keyword:
                <el-input v-model="select_word" placeholder="search keyword" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">Search</el-button>
                <el-button type="primary" icon="el-icon-lx-refresh" @click="reload">Reload</el-button> 
            </div>
            <el-table :data="view_data.slice((cur_page-1) * page_size, cur_page * page_size)" 
              border class="table" ref="multipleTable" 
                @selection-change="handleSelectionChange" 
                @filter-change="handleFilterChange">
                <el-table-column type="selection" width="55" column-key="selection" align="center"></el-table-column>
                <el-table-column prop="testrun_id" label="TestRun id" column-key="testrun_id"
                    <!-- :filters="[{text: '1', value: 1}, {text: '2', value: 2}]" 
                    :filter-method="filterHandler" -->
                    sortable>
                </el-table-column>
                <el-table-column prop="case_name" label="TestCase" column-key="case_name" sortable>
                </el-table-column>
                <el-table-column prop="case_result" label="Status" column-key="case_result" sortable>
                </el-table-column>
                <el-table-column prop="comment" label="Comment" column-key="comment">
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
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
                component_items: [],
                testrun_items: [],
                multipleSelection: [],
                select_component: '',
                select_testrun: '',
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
            getData() {
                fetchData({page: this.cur_page}).then((res) => {
                    this.tableData = res.data.data;
                    this.total_num = this.tableData.length
                    this.view_data = this.tableData
                    this.view_num = this.total_num
                    this.load_select_items()
                })
            },
            load_select_items() {
                var testruns = {}
                var components = {}
                this.component_items = new Array()
                this.testrun_items = new Array()
                for(let t of this.tableData) {
                    testruns[t.testrun_id] = t.testrun_id
                    components[t.index] = t.index
                }
                for(var key in testruns){
                    this.testrun_items.push({"key":key, "value":testruns[key]})
                }
                for(var key in components){
                    this.component_items.push({"key":key, "value":components[key]})
                }
                if(this.component_items.length===1){
                    this.select_component = this.component_items[0].value
                }
            },
            search() {
                this.view_data = this.tableData.filter((d) => {
                    // console.log(this.select_word)
                    if (
                        (this.select_component==='' || d.index===this.select_component) &&
                        (this.select_testrun==='' || d.testrun_id===this.select_testrun) &&
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
                this.select_component = ""
                this.select_testrun = ""
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
