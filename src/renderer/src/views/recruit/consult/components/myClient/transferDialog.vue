<template>
  <el-dialog v-model="props.transferVisible" title="移交客户" width="400" @close="close">
    <div v-if="props.ids.length">
      <el-form>
        <el-form-item label="已选客户">
          <el-tag v-for="item in props.names" :key="item" style="margin: 6px"> {{ item }}</el-tag>
        </el-form-item>
        <el-form-item label="移交给谁">
          <teachDialog placeholder="请选择接收人" v-model="receiver"></teachDialog>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import teachDialog from '@components/teach/teachDialog.vue'
import { consultTransfer } from '@api/recruitConsult'
import { ElMessage } from 'element-plus'
const props = defineProps({
  transferVisible: {
    type: Boolean,
    default: false
  },
  ids: {
    type: Array,
    default: []
  },
  names: {
    type: Array,
    default: []
  }
})
//选择到的顾问老师
let receiver = ref({
  id: '',
  realName: ''
})
//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:transferVisible', false)
}
//保存
const onSubmit = async () => {
  let res = await consultTransfer({
    customerIds: props.ids as string[],
    userId: receiver.value.id
  })
  if (res.code == '200') {
    ElMessage.success('移交成功')
  } else {
    ElMessage.success('移交失败')
  }
  emit('transferChange')
  close()
}
</script>
