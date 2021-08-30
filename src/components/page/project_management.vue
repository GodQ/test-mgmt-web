<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> Project Management</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button type="text" icon="el-icon-delete" 
            @click="handleProjectAdd">Add New
            </el-button>
        </div>
        <div class="container">
            <el-table :data="tableData" 
              border class="table" ref="multipleTable" >
                <el-table-column prop="project_id" label="project_id" column-key="project_id" sortable>
                </el-table-column>
                <el-table-column prop="created_time" label="created_time" column-key="created_time" sortable>
                </el-table-column>
                <el-table-column prop="test_result_count" label="test_result_count" column-key="test_result_count" sortable>
                </el-table-column>
                <el-table-column prop="store_size" label="store_size" column-key="store_size" sortable>
                </el-table-column>
                <el-table-column label="Actions" width="180" align="center" column-key="Actions">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" icon="el-icon-edit" @click="handleProjectEdit(scope.$index, scope.row)">Edit</el-button> -->
                        <el-button type="text" icon="el-icon-delete" @click="handleProjectDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- Add Project -->
        <el-dialog title="Add" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="Project Name">
                    <el-input v-model="form.project_id" :disabled="false"></el-input>
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
    import { addProject, listProjects, deleteProject } from '../../api/project';

    function sleep_ms (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    export default {
        name: 'project_management',
        data() {
            return {
                tableData: [],
                editVisible: false,
                addVisible: false,
                form: {
                    project_id: ''
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
                listProjects().then((res) => {
                    this.tableData = res.data.data;
                })
            },
            
            handleProjectDelete(index, row) {
                alert("Delete project is not supported now")
                return 0
                var project = JSON.parse(JSON.stringify(row))
                console.log(project)
                if(confirm("Delete Project?") == true){
                    deleteProject(project.project_id).then((res) => {
                        this.$message.success(`Delete Project Successfully`);
                        sleep_ms(2000).then(() => {
                            this.getData()
                        })
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
            },

            handleProjectEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.editVisible = true;
            },

            handleProjectAdd() {
                this.addVisible = true;
            },
            saveAdd() {
                // console.log(this.form)
                addProject(this.form).then((res) => {
                    this.addVisible = false;
                    this.$message.success(`Add Project Successfully`);
                    sleep_ms(2000).then(() => {
                        this.getData()
                    })
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
