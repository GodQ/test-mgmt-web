<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Mock Service</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" icon="el-icon-create" @click="handleCreateNew">New</el-button>
            <el-button type="primary" icon="el-icon-lx-refresh" @click="getData">Reload</el-button> 

            <el-table :data="tableData" 
              border class="table" ref="multipleTable" 
                @selection-change="handleSelectionChange" >
                <!-- <el-table-column type="selection" width="55" column-key="selection" align="center"></el-table-column> -->
                <el-table-column prop="mock_server_id" label="mock_server_id" column-key="mock_server_id" sortable>
                </el-table-column>
                <el-table-column prop="mock_url" label="mock_url" column-key="mock_url" sortable>
                </el-table-column>
                <el-table-column prop="access_url" label="access_url" column-key="access_url" sortable>
                </el-table-column>
                <el-table-column prop="monitor_web_url" label="monitor_web_url" column-key="monitor_web_url">
                </el-table-column>
                
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
                    <template slot-scope="scope">
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
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="Mock Server id">
                    <el-input v-model="form.mock_server_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Mock URL">
                    <el-input v-model="form.mock_url" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Access URL">
                    <el-input v-model="form.access_url" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Monitor Web URL">
                    <el-input v-model="form.monitor_web_url" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="Mock Rules">
                    <el-input v-model="form.mock_rules" :disabled="false"
                    type="textarea" :autosize="{ minRows: 10, maxRows: 50}"
                    ></el-input>
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
                <el-form-item label="Mock Server id">
                    <el-input v-model="create_form.mock_server_id" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="Mock URL">
                    <el-input v-model="create_form.mock_url" :disabled="false"></el-input>
                </el-form-item>

                <el-form-item label="Mock Rules">
                    <el-input v-model="create_form.mock_rules" :disabled="false"
                    type="textarea" :autosize="{ minRows: 10, maxRows: 50}"
                    ></el-input>
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
    get_mock_server, delete_mock_server } from '../../api/data_provider_for_mock';
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
                form: {
                    mock_server_id: '',
                    mock_url: '',
                    access_url: '',
                    monitor_web_url: '',
                    mock_rules: ''
                },
                create_form: {
                    mock_server_id: '',
                    mock_url: '',
                    mock_rules: ''
                },
            }
        },
        watch: {},
        created() {
            this.getData();
            console.log(sessionStorage.getItem('auth.user_role'))
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            getData(params) {
                list_mock_servers().then((res) => {
                    this.tableData = res.data.items;
                    this.total_num = this.tableData.length
                })
            },
            
            reload() {
                this.getData()
            },
            handleEdit(index, row) {
                var row_data = JSON.parse(JSON.stringify(row))
                var mock_server_id = row_data['mock_server_id']
                get_mock_server(mock_server_id).then((res) => {
                    this.form = res.data;
                    this.form.mock_rules = JSON.stringify(this.form.mock_rules)
                    this.editVisible = true;
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
                        this.getData()
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
                this.editVisible = false;
                var mock_server_id = this.form.mock_server_id
                var mock_rules = this.form.mock_rules
                var data = {
                    mock_rules: mock_rules
                }
                update_mock_server(mock_server_id, data).then((res) => {
                    // console.log(res)
                    this.$message.success(`Save successfully`);
                    this.getData()
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
                this.createVisible = false;
                var mock_rules = JSON.parse(this.create_form.mock_rules)
                var data = {
                    mock_server_id: this.create_form.mock_server_id,
                    mock_url: this.create_form.mock_url,
                    mock_rules: mock_rules
                }
                create_mock_server(data).then((res) => {
                    // console.log(res)
                    this.$message.success(`Save successfully`);
                    this.getData()
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
