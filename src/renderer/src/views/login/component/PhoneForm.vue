<template>
  <div class="phone-form">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" size="large">
      <el-form-item prop="mobile">
        <el-input
          v-model="ruleForm.mobile"
          prefix-icon="iphone"
          clearable
          placeholder="请输入手机号"
        >
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="captcha">
        <div class="login-msg-yzm">
          <el-input
            v-model="ruleForm.captcha"
            prefix-icon="unlock"
            clearable
            placeholder="请输入验证码"
          ></el-input>
          <el-button :disabled="disabled" @click="getCode">
            获取验证码
            <span v-if="disabled">({{ time }})</span>
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          round
          :loading="isLogin"
          @click="login(ruleFormRef)"
          >登录</el-button
        >
      </el-form-item>

      <el-form-item>
        <router-link to="">忘记密码？ </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PhoneRuleForm } from '@interface/login'
import { loginCaptcha, loginByMobile } from '@api/login'
import { Encrypt } from '@utils/aes'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PhoneRuleForm>({
  mobile: '15170241275',
  captcha: ''
})

// 校验手机号
const validatorTel = (_rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请填写正确手机号'))
  } else {
    callback()
  }
}
// 校验验证码
const validatorCaptcha = (_rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入短信验证码'))
  } else if (!/^\d{6}$/.test(value)) {
    callback(new Error('短信验证码必须为六位数字'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<PhoneRuleForm>>({
  mobile: [{ validator: validatorTel, trigger: 'blur' }],
  captcha: [{ validator: validatorCaptcha, message: '请输入验证码', trigger: 'blur' }]
})

// 验证码倒计时
const time = ref<number>(60)
const disabled = ref<boolean>(false)

// 登录加载中loading
const isLogin = ref<boolean>(false)

//获取验证码
const getCode = async () => {
  console.log('getCodeing')
  // 手机号通过校验才能发送验证码
  let validate = await ruleFormRef.value?.validateField('mobile', () => null)
  if (!validate) {
    return ElMessage.error('请填写正确的手机号')
  }

  // 发送验证码
  let res = await loginCaptcha({
    mobile: Encrypt(ruleForm.mobile)
  })
  if (res.code != '200') return ElMessage.error(res.msg)
  ElMessage.success('发送成功')

  // 开始倒计时
  disabled.value = true
  time.value = 5
  let timer = setInterval(() => {
    time.value -= 1
    if (time.value < 1) {
      clearInterval(timer)
      disabled.value = false
      time.value = 0
    }
  }, 1000)
  return
}

// 登录
const login = async (formEl: FormInstance | undefined) => {
  console.log('login---')
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isLogin.value = true
      await loginByMobile({
        mobile: Encrypt(ruleForm.mobile),
        captcha: Encrypt(ruleForm.captcha)
      })
    } else {
      return ElMessage.warning('请填写正确内容')
    }
    isLogin.value = false
    return
  })
}
</script>

<style lang="less" scoped>
.phone-form {
  .login-msg-yzm {
    display: flex;
    width: 100%;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
