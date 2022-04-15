<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Mock Service</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" icon="el-icon-create" @click="handleCreateNew">New</el-button>
            <el-button type="primary" icon="el-icon-lx-refresh" @click="refresh_mock_servers_table">Reload</el-button> 

            <el-table :data="tableData" 
              border class="table" ref="multipleTable" 
                @selection-change="handleSelectionChange" >
                <!-- <el-table-column type="selection" width="55" column-key="selection" align="center"></el-table-column> -->
                <el-table-column prop="mock_server_id" label="mock_server_id" column-key="mock_server_id" sortable>
                </el-table-column>
                <el-table-column prop="target_url" label="target_url" column-key="target_url" sortable>
                </el-table-column>
                <el-table-column prop="access_url" label="access_url" column-key="access_url" sortable>
                </el-table-column>
                <el-table-column prop="monitor_web_url" label="monitor_web_url" column-key="monitor_web_url" sortable>
                </el-table-column>
                <el-table-column width="100" prop="status" label="status" column-key="status" sortable>
                </el-table-column>
                
                <el-table-column label="Actions" width="250" align="center" column-key="Actions">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-video-play" 
                            @click="handleStart(scope.$index, scope.row)">Start</el-button>
                        <el-button type="text" icon="el-icon-video-pause" 
                            @click="handleStop(scope.$index, scope.row)">Stop</el-button>
                        <el-button type="text" icon="el-icon-edit" 
                            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button type="text" icon="el-icon-delete" 
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- Edit -->
        <el-dialog title="Edit" :visible.sync="editVisible" width="40%">
            <el-form ref="edit_form" :model="edit_form" label-width="100px">
                <el-form-item label="Mock id">
                    <el-input v-model="edit_form.mock_server_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Mock URL">
                    <el-input v-model="edit_form.target_url" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Access URL">
                    <el-input v-model="edit_form.access_url" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Monitor Web URL">
                    <el-input v-model="edit_form.monitor_web_url" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="Mock Rules">
                    <el-input v-model="edit_form.mock_rules" :disabled="false"
                    type="textarea" :autosize="{ minRows: 10, maxRows: 50}"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-lx-refresh" @click="format_edit_mock_rules">Format</el-button> 
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit" >Submit</el-button>
            </span>
        </el-dialog>

        <!-- Create New -->
        <el-dialog title="Create New" :visible.sync="createVisible" width="40%">
            <el-form ref="create_form" :model="create_form" label-width="100px">
                <el-form-item label="Mock id">
                    <el-input v-model="create_form.mock_server_id" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="Mock URL">
                    <el-input v-model="create_form.target_url" :disabled="false"></el-input>
                </el-form-item>

                <el-form-item label="Mock Rules">
                    <el-input v-model="create_form.mock_rules" :disabled="false"
                    type="textarea" :autosize="{ minRows: 10, maxRows: 50}"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-lx-refresh" @click="format_create_mock_rules">Format</el-button> 
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveNew" >Submit</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { create_mock_server, list_mock_servers, update_mock_server, 
    get_mock_server, start_mock_server, stop_mock_server, delete_mock_server } from '../../api/data_provider_for_mock';
    export default {
        name: 'mock_service',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                page_size: 10,
                total_num: 0,
                multipleSelection: [],
                editVisible: false,
                createVisible: false,
                edit_form: {
                    mock_server_id: '',
                    target_url: '',
                    access_url: '',
                    monitor_web_url: '',
                    mock_rules: ''
                },
                create_form: {
                    mock_server_id: '',
                    target_url: '',
                    mock_rules: ''
                },
            }
        },
        watch: {},
        created() {
            this.refresh_mock_servers_table();
            console.log(sessionStorage.getItem('auth.user_role'))
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            refresh_mock_servers_table(params) {
                list_mock_servers().then((res) => {
                    this.tableData = res.data.items;
                    this.total_num = this.tableData.length
                })
            },
            
            reload() {
                this.refresh_mock_servers_table()
            },
            handleEdit(index, row) {
                var row_data = JSON.parse(JSON.stringify(row))
                var mock_server_id = row_data['mock_server_id']
                get_mock_server(mock_server_id).then((res) => {
                    this.edit_form = res.data;
                    this.edit_form.mock_rules = JSON.stringify(this.edit_form.mock_rules, null, " ")
                    this.editVisible = true;
                })
            },
            handleStart(index, row) {
                var row_data = JSON.parse(JSON.stringify(row))
                var mock_server_id = row_data['mock_server_id']
                start_mock_server(mock_server_id).then((res) => {
                    this.refresh_mock_servers_table()
                })
            },
            handleStop(index, row) {
                var row_data = JSON.parse(JSON.stringify(row))
                var mock_server_id = row_data['mock_server_id']
                stop_mock_server(mock_server_id).then((res) => {
                    this.refresh_mock_servers_table()
                })
            },
            handleDelete(index, row) {
                var row_data = JSON.parse(JSON.stringify(row))
                var mock_server_id = row_data['mock_server_id']
                var msg = 'Do you want to delete mock server '+mock_server_id+'?'
                this.$confirm(msg, 'Warning', {
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    type: 'warning'
                }).then(() => {
                    delete_mock_server(mock_server_id).then((res) => {
                        this.$message({
                            type: 'success',
                            message: 'Delete Successfully!'
                        });
                        this.refresh_mock_servers_table()
                    })
                })
                
            },
            handleCreateNew() {
                this.createVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                var mock_server_id = this.edit_form.mock_server_id
                var mock_rules = this.edit_form.mock_rules
                var data = {
                    mock_rules: mock_rules
                }
                update_mock_server(mock_server_id, data).then((res) => {
                    // console.log(res)
                    this.editVisible = false;
                    this.$message.success(`Save successfully`);
                    this.refresh_mock_servers_table()
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
            },
            saveNew() {
                if(this.create_form.mock_rules)
                    var mock_rules = JSON.parse(this.create_form.mock_rules)
                else
                    var mock_rules = []
                var data = {
                    mock_server_id: this.create_form.mock_server_id,
                    target_url: this.create_form.target_url,
                    mock_rules: mock_rules
                }
                create_mock_server(data).then((res) => {
                    // console.log(res)
                    this.createVisible = false;
                    this.$message.success(`Save successfully`);
                    this.refresh_mock_servers_table()
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
            },
            format_create_mock_rules(){
                var rules = this.create_form.mock_rules;
                rules = JSON.stringify(JSON.parse(rules), null, " ");
                this.create_form.mock_rules = rules;
            },
            format_edit_mock_rules(){
                var rules = this.edit_form.mock_rules;
                rules = JSON.stringify(JSON.parse(rules), null, " ");
                this.edit_form.mock_rules = rules;
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
