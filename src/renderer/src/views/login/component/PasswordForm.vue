<template>
  <div class="password-form">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" size="large">
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          prefix-icon="user"
          clearable
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          prefix-icon="lock"
          clearable
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <div class="box-code">
          <el-input
            v-model="ruleForm.captcha"
            prefix-icon="CircleCheck"
            clearable
            placeholder="请输入验证码"
          ></el-input>
          <el-image class="code"></el-image>
        </div>
      </el-form-item>

      <div class="remember">
        <div>
          <el-checkbox label="记住密码"></el-checkbox>
        </div>
        <div>
          <router-link to="">忘记密码？</router-link>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" round style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const ruleForm = reactive({
  username: '',
  password: '',
  key: '',
  captcha: ''
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
</script>

<style lang="less" scoped>
.password-form {
  .box-code {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .code {
    margin-left: 10px;
    width: 100px;
    height: 40px;
    cursor: pointer;
  }
  .remember {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>
