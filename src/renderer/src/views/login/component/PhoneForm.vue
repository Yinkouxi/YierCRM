<template>
  <div class="phone-form">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" size="large">
      <el-form-item prop="mobile">
        <el-input
          v-model="ruleForm.mobile"
          prefix-icon="iphone"
          clearable
          :placeholder="$t('login.mobileError')"
          @keyup.enter="login(ruleFormRef)"
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
            :placeholder="$t('login.smsError')"
          ></el-input>
          <el-button :disabled="disabled" @click="getCode">
            {{ $t('login.smsGet') }}
            <span v-if="disabled">({{ time }})</span>
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <router-link to="" class="forget">{{ $t('login.forgetPassword') }}</router-link>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          round
          :loading="isLogin"
          @click="login(ruleFormRef)"
          >{{ $t('login.signIn') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ComponentInternalInstance, getCurrentInstance, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PhoneRuleForm } from '@interface/login'
import { loginCaptcha, loginByMobile } from '@api/login'
import { Encrypt } from '@utils/aes'
import useLogin from '@hooks/useLogin'

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PhoneRuleForm>({
  mobile: '15170241275',
  captcha: ''
})

// 校验手机号
const validatorTel = (_rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error(proxy?.$t('login.mobileError')))
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error(proxy?.$t('login.mobileError1')))
  } else {
    callback()
  }
}
// 校验验证码
const validatorCaptcha = (_rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error(proxy?.$t('login.smsError')))
  } else if (!/^\d{6}$/.test(value)) {
    callback(new Error(proxy?.$t('login.smsError1')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<PhoneRuleForm>>({
  mobile: [{ validator: validatorTel, trigger: 'blur' }],
  captcha: [{ validator: validatorCaptcha, trigger: 'blur' }]
})

// 验证码倒计时
const time = ref<number>(60)
const disabled = ref<boolean>(false)

// 登录加载中loading
const isLogin = ref<boolean>(false)

//获取验证码
const getCode = async () => {
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
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isLogin.value = true
      const res = await loginByMobile({
        mobile: Encrypt(ruleForm.mobile),
        captcha: Encrypt(ruleForm.captcha)
      })
      useLogin(res)
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
