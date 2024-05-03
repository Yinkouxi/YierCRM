<template>
  <el-container>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span style="color: #409eff">学员信息</span>
              </div>
            </template>
            <el-form>
              <el-form-item>
                <el-autocomplete
                  v-model="searchName"
                  :fetch-suggestions="querySearch"
                  popper-class="my-autocomplete"
                  placeholder="输入学员姓名/手机号进行搜索"
                  @select="handleSelect"
                  suffix-icon="Search"
                >
                  <template #default="{ item }">
                    <div class="customer">
                      <div class="name">
                        {{ item.name }}（
                        <template v-if="item.gender == 1">男</template>
                        <template v-else-if="item.gender == 2">女</template>
                        <template v-else>未知</template>
                        ）
                      </div>
                      <div class="wechat">
                        <el-icon-iphone style="width: 14px" /> {{ item.mobile }}
                      </div>
                      <div class="wechat">
                        <el-icon-chat-round style="width: 14px" /> {{ item.wechat }}
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
                <el-button type="primary" style="margin-left: 15px" @click="add"
                  >创建学员</el-button
                >
              </el-form-item>
              <el-form-item>
                <div v-if="clientInfo.name" class="info">
                  <div class="person">
                    <span style="font-size: 24px; font-weight: bold">{{ clientInfo.name }}</span>
                    <template v-for="item in dicts.system_global_gender">
                      <el-tag
                        v-if="clientInfo.gender == item.v"
                        style="margin-left: 15px; position: absolute; top: 5px"
                      >
                        {{ item.k }}
                      </el-tag>
                    </template>
                    <span style="margin-left: 80px">{{ clientInfo.mobile }}</span>
                  </div>
                  <div class="lesson">
                    <div>
                      <span>意向课程：</span>
                      <el-tag v-for="item in clientInfo.subjects" style="margin-left: 10px"
                        >{{ item.subjectName }}
                      </el-tag>
                    </div>
                    <div>
                      <span>意向班级：</span>
                      <el-tag v-for="item in clientInfo.classes" style="margin-left: 10px">{{
                        item.className
                      }}</el-tag>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { consultPage, IConsultList, consultDetail, IConsultDetail } from '@api/recruitConsult'
import { dicts } from '@mixins/DIctsPlugin';
import { useRouter } from 'vue-router'
const router = useRouter()
//选择到的用户名称
let searchName = ref('')
//选择到的用户数据
let clientInfo = reactive<Partial<IConsultDetail>>({})
//生命周期
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_gender'])
  }
})
//搜索用户
const querySearch = async (queryString: string, cb: any) => {
  let res = await consultPage({
    current: 1,
    size: 10,
    selectName: queryString
  })
  let { records } = res.data
  if (res.code == '200') {
    cb(records)
  }
}
//选择用户
const handleSelect = async (item: IConsultList) => {
  searchName.value = item.name
  let res = await consultDetail(item.id)
  Object.assign(clientInfo, res.data)
}

//新建咨询
const add = () => {
  router.push('/recruit/consult/add')
}
</script>

<style scoped lang="less">
.info {
  display: flex;
  flex-direction: column;
}

.btn {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choosenLabel {
  width: 100%;
  height: 30px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: bold;
  }
}

.payment-table {
  border-top: #e2e2e2 solid 1px;
  border-left: #e2e2e2 solid 1px;

  th,
  td {
    border-right: #e2e2e2 solid 1px;
    border-bottom: #e2e2e2 solid 1px;
    padding: 10px;
    line-height: 30px;
  }

  th {
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-lighter);
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
  }
}

.enroll {
  border: 1px solid #d4dfe5;
  border-top: 3px solid var(--el-color-primary);
  padding-top: 6px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 15px;

  .choices {
    margin-left: 15px;
    width: 100%;
    height: 40px;
  }

  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 65px;
    background: #f2f8ff;
    opacity: 1;
    border-top: 1px solid #d4dfe5;
    border-bottom: 1px solid #d4dfe5;

    > div {
      margin: 15px;
    }

    .left {
      display: flex;
      align-items: center;

      span:nth-child(2) {
        margin-left: 15px;
      }
    }

    .right {
      span {
        margin-left: 10px;
      }

      span:nth-child(2) {
        font-size: 22px;
        font-weight: bold;
      }

      span:nth-child(5) {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }

  .section {
    border-bottom: 1px solid #d4dfe5;
    width: 100%;
    display: flex;
    flex-direction: column;

    > .title {
      color: var(--el-text-color-regular);
      width: 100%;
      height: 50px;
      margin: 0 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .content,
    .fee {
      margin: 0 15px;
    }

    .fee {
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 15px;
    }
  }
}

.account {
  border-top: 3px solid var(--el-color-primary);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  margin-bottom: 15px;
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
  }

  .form {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .bottom {
    padding: 10px;

    .btn {
      width: 100%;
      height: 50px;
      border: 1px solid #d4dfe5;
      text-align: center;
      line-height: 45px;
    }
  }
}

.gather {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  color: var(--el-text-color-regular);
  span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: bold;
  }
}

.customer {
  width: 100%;
  border-bottom: #e2e2e2 dashed 1px;
}

.discount {
  border-bottom: 1px solid #d4dfe5;
  width: 100%;
  display: flex;
  flex-direction: column;

  > .title {
    height: 50px;
    margin: 0 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .result {
    margin: 0 15px;
  }

  .content {
    margin: 0 15px 15px 15px;
  }
}

.tag {
  z-index: 999;
  cursor: pointer;
}
</style>
