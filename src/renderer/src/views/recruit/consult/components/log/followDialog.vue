<template>
  <el-dialog v-model="props.followVisible" title="新建跟进信息" width="800" @close="close">
    <el-form :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="跟进方式" prop="followMethod">
            <el-select v-model="form.followMethod" placeholder="请选择跟进方式">
              <el-option
                v-for="item in dicts.recruit_follow_method"
                :key="item.k"
                :label="item.k"
                :value="item.v"
                >{{ item.k }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="跟进时间" prop="followTime">
            <el-date-picker
              v-model="form.followTime"
              type="datetime"
              placeholder="选择跟进时间"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次回访时间" prop="followNextTime">
            <el-date-picker
              v-model="form.followNextTime"
              type="datetime"
              placeholder="选择下次回访时间"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="跟进内容" prop="followContent">
            <el-input
              v-model="form.followContent"
              type="textarea"
              maxlength="200"
              rows="3"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="followContent">
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              multiple
              :limit="5"
              :http-request="upload"
            >
              <el-button type="primary">上传附件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  可上传图片和音频，支持格式：jpg、jpeg、png、mp3、mp4
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table row-key="id" :data="tableData" width="100%" border stripe>
      <el-table-column label="序号" type="index" width="60" align="center"> </el-table-column>
      <el-table-column label="跟进方式" prop="followMethod">
        <template #default="{ row }">
          <template v-for="item in dicts.recruit_follow_method">
            <el-text v-if="row.followMethod == item.v">{{ item.k }}</el-text>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="跟进时间" prop="followTime"></el-table-column>
      <el-table-column label="下次回访时间" prop="followNextTime"></el-table-column>
      <el-table-column label="顾问老师" prop="roleManName"></el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import {
  followPage,
  IFollowPageRecords,
  IFollowAddFiles,
  followAdd,
  IFollowAddParams
} from '@api/recruitConsult'
import tool from '@utils/tool'
import { ElMessage } from 'element-plus'
import { dicts } from '@mixins/DIctsPlugin'
const props = defineProps({
  followVisible: {
    type: Boolean,
    default: false
  },
  followId: {
    type: String,
    default: ''
  }
})

//form数据
const form = reactive<IFollowAddParams>({
  customerId: props.followId,
  followMethod: '',
  followTime: '',
  followContent: '',
  followNextTime: ''
})

//table数据
let tableData = ref<IFollowPageRecords[]>([])

//生命周期
onBeforeMount(async () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['recruit_follow_method', 'recruit_follow_method'])
  }

  //跟进记录
  let res = await followPage({
    page: 1,
    size: 10,
    customerId: props.followId
  })
  let { records } = res.data
  tableData.value = records
})

//上传文件
let fileList = ref([])
type UploadUserFile = {
  file: File
}
const followFiles = ref<IFollowAddFiles[]>([])
const upload = async (options: UploadUserFile) => {
  let res = await tool.oss?.upload(options.file)
  let temp: IFollowAddFiles = {
    name: '',
    url: '',
    fileType: '',
    fileSize: 0
  }
  temp.name = res.name
  temp.url = res.url
  temp.fileType = options.file.type
  temp.fileSize = options.file.size
  followFiles.value.push(temp)
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:followVisible', false)
}

//保存
const onSubmit = async () => {
  let res = await followAdd({
    followFiles: followFiles.value,
    follow: form
  })
  if (res.code != '200') {
    return ElMessage.info(res.msg)
  }

  ElMessage.success(res.msg)
  emit('change')
  close()
  return
}
</script>
