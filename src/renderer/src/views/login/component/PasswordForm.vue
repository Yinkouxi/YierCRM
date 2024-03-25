<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" size="large">
    <el-form-item prop="username">
      <el-input
        v-model="ruleForm.username"
        prefix-icon="user"
        clearable
        :placeholder="$t('login.mobileError')"
        @keyup.enter="login(ruleFormRef)"
      ></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        prefix-icon="lock"
        clearable
        show-password
        :placeholder="$t('login.PWPlaceholder')"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <div class="box-code">
        <el-input
          v-model="ruleForm.captcha"
          prefix-icon="CircleCheck"
          clearable
          :placeholder="$t('login.smsError')"
        ></el-input>
        <el-image class="code" :src="captchaUrl" @click="getCaptcha"></el-image>
      </div>
    </el-form-item>

    <div class="remember">
      <div>
        <el-checkbox
          :label="$t('login.rememberMe')"
          v-model="memoPassWord"
          @change="onMemoPassWord"
        ></el-checkbox>
      </div>
      <div>
        <router-link to="">{{ $t('login.forgetPassword') }}</router-link>
      </div>
    </div>

    <el-form-item>
      <el-button
        type="primary"
        round
        style="width: 100%"
        :loading="isLogin"
        @click="login(ruleFormRef)"
        >{{ $t('login.signIn') }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  onBeforeMount,
  getCurrentInstance,
  ComponentInternalInstance,
  Ref
} from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { captchaImage, loginByJson } from '@api/login'
import { Decrypt, Encrypt } from '@utils/aes'
import { UserRuleForm } from '@interface/login'
import { useRouter } from 'vue-router'
import useLogin from '@hooks/useLogin'

const { proxy } = getCurrentInstance() as ComponentInternalInstance

// 验证码图片URL
let captchaUrl = ref<string>('')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<UserRuleForm>({
  username: 'admin',
  password: '',
  key: '',
  captcha: ''
})
let rules = reactive<FormRules>({})
const isLogin = ref<boolean>(false)

//验证码
const getCaptcha = async () => {
  const key: string = new Date().getTime().toString()
  ruleForm.key = key
  let res = await captchaImage({ key })
  let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  let imgUrl = URL.createObjectURL(blob)
  captchaUrl.value = imgUrl
}

//生命周期
onBeforeMount(() => {
  let userPwd: string | null = localStorage.getItem('user-pwd')
  if (userPwd) {
    let { username, password }: { username: string; password: string } = JSON.parse(userPwd)
    ruleForm.username = Decrypt(username)
    ruleForm.password = Decrypt(password)
  }

  rules = {
    username: [{ required: true, message: proxy?.$t('login.userError'), trigger: 'blur' }],
    password: [{ required: true, message: proxy?.$t('login.PWPlaceholder'), trigger: 'blur' }]
  }
  getCaptcha()
})

const router = useRouter()
// 登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl?.validate(async (valid) => {
    if (valid) {
      isLogin.value = true
      let res = await loginByJson({
        username: Encrypt(ruleForm.username),
        password: Encrypt(ruleForm.password),
        key: ruleForm.key,
        captcha: ruleForm.captcha
      })
      // 使用hooks
      useLogin(res)
      // 记住密码
      setMemoPassWord()
      // if (res.code === '200') {
      //   isLogin.value = false
      //   // 1.持久化存储token
      //   const token = res.data
      //   localStorage.setItem('TOKEN', token || '')
      //   // 2.获取用户信息
      //   await useUserStore().getUserInfo()
      //   // 3.获取路由
      //   await useMenuStore().getMenu()
      //   // 4.跳转首页
      //   router.push('/')
      //   return ElMessage.success('登录成功')
      // } else {
      //   isLogin.value = false
      //   return ElMessage.error(res.msg)
      // }
      isLogin.value = false
      return
    } else {
      isLogin.value = false
      return ElMessage.warning('请填写正确内容')
    }
  })
  return
}

import useMemoPassWord from '@hooks/useMemoPassWord'
const { onMemoPassWord, memoVal } = useMemoPassWord()
const memoPassWord: Ref<boolean> = ref(memoVal)

const setMemoPassWord = () => {
  if (memoPassWord.value) {
    const userPwd: {
      username: string
      password: string
    } = {
      username: Encrypt(ruleForm.username),
      password: Encrypt(ruleForm.password)
    }
    localStorage.setItem('user-pwd', JSON.stringify(userPwd))
  } else {
    localStorage.removeItem('user-pwd')
  }
}
</script>

<style scoped>
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
</style>
