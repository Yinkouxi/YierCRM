<template>
  <el-container>
    <el-header class="titleBar" height="40px">
      <div class="title">聊天窗口</div>
      <!-- 关闭 -->
      <div>
        <el-icon class="close" size="large" @click="closeChat">
          <el-icon-close />
        </el-icon>
      </div>
    </el-header>
    <el-container>
      <!--    左-->
      <el-aside width="240px">
        <el-input
          prefix-icon="el-icon-search"
          v-model="input"
          placeholder="搜索联系人"
          :clearable="true"
        />
        <el-tabs type="border-card" style="height: 428px">
          <el-tab-pane label="联系人">
            <el-tree
              ref="treeRef"
              :data="treeList"
              :props="treeProps"
              :expand-on-click-node="false"
              highlight-current
              default-expand-all
              :filter-node-method="onTreeFilter"
              node-key="id"
              @node-click="onNodeClick"
            >
              <template #default="{ node, data }">
                <div v-if="data.type === '_type_unit'">{{ data.name }}</div>
                <div v-if="data.type === '_type_user'" class="contacts-user-item">
                  <el-avatar
                    :src="data.avatar"
                    size="small"
                    :class="isOnline(data.id) ? 'online' : 'offline'"
                  />
                  {{ data.name }}
                </div>
              </template>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="会话列表">
            <!-- <div class="session-list">
              <div
                class="session-list-item"
                v-for="item in sessionList"
                :key="item.id"
                style="margin-bottom: 10px"
                @click="goChat(item)"
                :id="item.id"
              >
                <template v-if="item.promoter == -1">
                  <el-avatar circle src="/images/logo.png" />
                  <div class="info">
                    <h4>系统消息</h4>
                    <span class="info-text">{{ item.messages[0]?.messageBodyContent }}</span>
                  </div>
                </template>
                <template v-else>
                  <el-avatar
                    circle
                    :src="item.promoter === userInfo.id ? item.partakerAvatar : item.promoterAvatar"
                  />
                  <div class="info">
                    <h4>
                      {{
                        item.promoter === userInfo.id
                          ? item.partakerUsername
                          : item.promoterUsername
                      }}
                    </h4>
                    <span class="info-text">{{ item.messages[0]?.messageBodyContent }}</span>
                  </div>
                </template>
                <div class="close-btn" text @click="deleteSession(item.id)">
                  <el-icon>
                    <el-icon-close />
                  </el-icon>
                </div>
              </div>
            </div> -->
            <div v-if="sessionList.length == 0">
              <h3 style="text-align: center">暂无聊天会话</h3>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <!-- 右侧 -->
      <el-aside width="260px">
        <el-card :body-style="{ padding: '0px' }" style="height: 100%">
          <div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px">
            <el-avatar size="large" :src="userInfo.avatar" />
            <h2 style="margin-top: 10px">{{ userInfo.username }}</h2>
            <p style="margin-top: 5px">{{ userInfo.realName }}</p>
          </div>
          <div style="margin: 20px">
            <el-text class="mx-1" type="info">
              <el-icon>
                <el-icon-user />
              </el-icon>
              <span class="textUser">{{ userInfo.realName }}</span>
            </el-text>
            <el-text class="mx-1" type="info">
              <el-icon>
                <el-icon-iphone />
              </el-icon>
              <span class="textUser">{{ userInfo.phone }}</span>
            </el-text>
            <el-text class="mx-1" type="info">
              <el-icon>
                <el-icon-message />
              </el-icon>
              <span class="textUser">{{ userInfo.email }}</span>
            </el-text>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { contacts, sessions } from '@api/chat'
import { useUserStore } from '@store/useUserStore'
import { onBeforeMount, reactive, ref } from 'vue'

const getContacts = async () => {
  let res = await contacts({})
  treeList.value = res.data
}

// 左侧
// 搜索联系人
const input = ref('')
// 联系人数组
let treeList = ref([])
let treeProps = reactive({ label: 'name', children: 'children' })

const onTreeFilter = () => {}
const onNodeClick = () => {}
// 联系人是否在线
const isOnline = (id) => {
  return true
}
//会话列表数据
const sessionList = ref([])
// 获取会话列表
const getSessions = async () => {
  let {data} = await sessions({})
  console.log(data)
  sessionList.value = data.records
}
onBeforeMount(() => {
  getContacts()
  getSessions()
})
// 右侧个人信息
const userStore = useUserStore()
const userInfo = userStore.userInfo

// 关闭窗口
const closeChat = () => {}
</script>

<style lang="less" scoped>
.titleBar {
  -webkit-app-region: drag;
  user-select: none;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  border-bottom: #d8dcde 1px solid;
}

.title {
  -webkit-app-region: no-drag;
  font-size: 14px;
  font-weight: bold;
  color: #3c4a54;
}

.close {
  -webkit-app-region: no-drag;
  cursor: pointer;
  margin-top: 12px;
}

.session-list {
  list-style: none;

  .session-list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    .el-avatar {
      margin-right: 10px;
      width: 40px;
    }

    .info {
      width: calc(100% - 70px);
      flex: 1;

      h4 {
        height: 20px;
        line-height: 20px;
      }

      .info-text {
        display: inline-block;
        width: 100%;
        line-height: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #6b6d71;
      }
    }

    .close-btn {
      width: 20px;
    }
  }
}

:deep(.el-tree-node__content) {
  height: unset !important;
}

.offline {
  filter: grayscale(100%);
}

.mx-1 {
  display: block;
}

.textUser {
  margin-left: 10px;
}

.chat-room {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f5f5f5;

  .chat-header {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    border-bottom: #dddddd solid 1px;

    h3 {
      line-height: 50px;
      font-weight: normal;
      font-size: 16px;
    }

    .el-avatar {
      margin: 0 10px;
      width: 35px;
      height: 35px;
      border: #f2f2f2 solid 1px;
    }
  }

  .chat-body {
    width: 100%;
    height: 320px;
    overflow-y: auto;
    background: #ffffff;

    .chat-message-ul {
      display: flex;
      flex-direction: column;

      li {
        overflow: hidden;
        margin: 0 0 20px 0;
      }

      .left_word {
        span {
          float: left;
          background-color: #f2f2f2;
          padding: 10px;
          max-width: 290px;
          border-radius: 12px;
          font-size: 14px;
          color: #000;
          margin-left: 13px;
          position: relative;
          line-height: 24px;
          word-break: break-word;
        }

        span:before {
          content: '';
          position: absolute;
          left: -8px;
          top: 3px;
          width: 13px;
          height: 10px;
        }
      }

      .right_word {
        span {
          float: right;
          background-color: #a9ea79;
          padding: 10px;
          max-width: 290px;
          border-radius: 12px;
          font-size: 14px;
          color: #000;
          margin-right: 13px;
          position: relative;
          line-height: 24px;
          word-break: break-word;
        }

        span:before {
          content: '';
          position: absolute;
          right: -8px;
          top: 3px;
          width: 13px;
          height: 10px;
        }
      }
    }
  }

  .chat-footer {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    border-top: #dddddd solid 1px;

    .el-textarea {
      height: 100%;

      :deep(.el-textarea__inner) {
        height: 100% !important;
      }
    }

    .el-button {
      width: 100px;
      height: 100%;
    }
  }
}

.contacts-user-item {
  height: 40px;
  display: flex;
  align-items: center;

  .el-avatar {
    margin-right: 5px;
    border: #f2f2f2 solid 1px;
  }
}
</style>
