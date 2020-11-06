<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> User Management</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button type="text" icon="el-icon-delete" 
            @click="handleUserAdd">Add New
            </el-button>
        </div>
        <div class="container">
            <el-table :data="tableData" 
              border class="table" ref="multipleTable" >
                <el-table-column prop="user_name" label="user_name" column-key="user_name" sortable>
                </el-table-column>
                <el-table-column prop="role" label="role" column-key="role" sortable>
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" @click="handleUserDelete(scope.$index, scope.row)">Delete</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleUserEdit(scope.$index, scope.row)">Edit</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- Edit User -->
        <el-dialog title="Edit" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="User Name">
                    <el-input v-model="form.user_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="form.password" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="Role">
                    <el-input v-model="form.role" :disabled="false"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit">Submit</el-button>
            </span>
        </el-dialog>

        <!-- Add User -->
        <el-dialog title="Add" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="User Name">
                    <el-input v-model="form.user_name" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="form.password" :disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="Role">
                    <el-input v-model="form.role" :disabled="false"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveAdd">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { addUser, listUsers, editUser, deleteUser } from '../../api/user';

    function sleep_ms (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    export default {
        name: 'user_management',
        data() {
            return {
                tableData: [],
                editVisible: false,
                addVisible: false,
                form: {
                    user_name: '',
                    password: '',
                    role: ''
                }
            }
        },
        watch: {},
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData
            }
        },
        methods: {
            getData() {
                listUsers().then((res) => {
                    this.tableData = res.data.data;
                })
            },
            
            handleUserDelete(index, row) {
                var user = JSON.parse(JSON.stringify(row))
                console.log(user)
                if(confirm("Delete User?") == true){
                    deleteUser(user.user_name).then((res) => {
                        this.$message.success(`Delete User Successfully`);
                        sleep_ms(2000).then(() => {
                            this.getData()
                        })
                    }).catch(function (error) {
                    console.error(error)
                    if (error.response) {
                        alert(error.response.data.error)
                    }
                    else{
                        alert(error.message)
                    }
                });
                }
            },

            handleUserEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.editVisible = true;
            },
            saveEdit() {
                editUser(this.form).then((res) => {
                    this.editVisible = false;
                    this.$message.success(`Edit Successfully`);
                    sleep_ms(2000).then(() => {
                        this.getData()
                    })
                }).catch(function (error) {
                    console.error(error)
                    if (error.response) {
                        alert(error.response.data.error)
                    }
                    else{
                        alert(error.message)
                    }
                });
            },

            handleUserAdd() {
                this.addVisible = true;
            },
            saveAdd() {
                // console.log(this.form)
                addUser(this.form).then((res) => {
                    this.addVisible = false;
                    this.$message.success(`Add User Successfully`);
                    sleep_ms(2000).then(() => {
                        this.getData()
                    })
                }).catch(function (error) {
                    console.error(error)
                    if (error.response) {
                        alert(error.response.data.error)
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
