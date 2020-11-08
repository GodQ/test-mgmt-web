<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">Test Management System</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" disabled=true icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" disabled=true icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
                </div>
                <p class="login-tips">Tips : input user name and password。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { getToken, useToken} from '../../api/auth';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: 'Please input user name', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please input user password', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.ruleForm)
                        getToken(this.ruleForm.username, this.ruleForm.password).then((res) => {
                            // console.log(res.data)
                            var status = res.status
                            if (status != 201) {
                                alert("Login Failed!!!")
                                return false
                            }
                            var token = res.data.token
                            console.log("Get token: "+token)
                            useToken(token)
                            sessionStorage.setItem('auth.user_name',res.data.user_name);
                            sessionStorage.setItem('auth.user_role',res.data.role);
                            this.$router.push('/');
                            return true
                        }
                        ).catch(err => {
                            alert("Login Failed!!! \n"+err)
                            return false
                        })
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>