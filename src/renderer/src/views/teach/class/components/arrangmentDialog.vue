<template>
  <el-dialog
    width="630"
    :destroy-on-close="true"
    title="排课"
    v-model="props.lessonVisible"
    @close="close"
  >
    <div class="container">
      <div class="calendar">
        <ul class="weekdays">
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
          <li>日</li>
        </ul>
        <ul class="days">
          <li class="days-item" v-for="i in spareDays" />
          <li
            v-for="item in lessonDate"
            :key="item.id"
            :class="{ selected: item.teached }"
            @click="handleClick(item)"
          >
            <div class="date">
              {{ item.dateStr.split('-')[1] }}-{{ item.dateStr.split('-')[2] }}
            </div>
            <div class="year">{{ item.dateStr.split('-')[0] }}</div>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="warning" style="margin-left: 10px" @click="selectAll">全选</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { recruitWorkGet, IRecruitWorkGet, recruitWorkSave } from '@api/teachClass'
import { ElMessage } from 'element-plus'
const props = defineProps({
  lessonVisible: {
    type: Boolean,
    default: false
  },
  lessonId: {
    type: String,
    default: ''
  }
})

onBeforeMount(() => {
  setData(props.lessonId)
})

//开班时间之前
let spareDays = ref(0)
//开班时间
let lessonDate = ref<IRecruitWorkGet[]>([])
//获取开班时间
const setData = async (classId: string) => {
  console.log(classId)
  let res = await recruitWorkGet({ classId })
  lessonDate.value = res.data

  //判断起止日星期
  let spareDay = new Date(lessonDate.value[0].dateStr).getDay()
  spareDays.value = spareDay == 0 ? 6 : spareDay - 1
}
//点击日期
const handleClick = (item: IRecruitWorkGet): any => {
  if (item.id) return ElMessage.info('已经排课了~')
  item.teached = item.teached == 0 ? 1 : 0
}

//全选
const selectAll = () => {
  lessonDate.value.forEach((item: IRecruitWorkGet) => {
    item.teached = 1
  })
}
//保存
const save = async () => {
  try {
    let res = await recruitWorkSave(lessonDate.value)
    ElMessage.success(res.msg)
    close()
    emit('change')
  } catch (err) {
    ElMessage.error('该课程已经排课')
  }
}

//关闭dialog
const emit = defineEmits()
const close = () => {
  emit('update:lessonVisible', false)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 588px;
    border: #f2f2f2 solid 1px;
    .weekdays {
      width: 100%;
      display: flex;
      list-style: none;
      li {
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        line-height: 35px;
        height: 35px;
        background: var(--el-color-info-light-9);
        cursor: pointer;
      }
    }

    .days {
      width: 100%;
      min-height: 240px;
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      li {
        box-sizing: border-box;
        width: calc(100% / 7 - 10px);
        height: 74px;
        border: 2px solid #409eff;
        margin: 5px;
        cursor: pointer;
        border-radius: 5px;
        color: #193f6e;
        overflow: hidden;
        .date {
          width: 100%;
          height: 44px;
          line-height: 44px;
          font-size: 20px;
          font-weight: bold;
        }
        .year {
          width: 100%;
          height: 30px;
          line-height: 30px;
          background: rgba(64, 158, 255, 1);
          color: #fff !important;
        }
      }
    }
  }
}

.days-item {
  border: transparent solid 1px !important;
}

.selected {
  background: rgba(64, 158, 255, 0.7);
  .date {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    color: #fff !important;
  }
  .year {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: rgba(64, 158, 255, 1);
    color: #fff !important;
  }
}
</style>
