<template>
  <div style="height: 100%">
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="角色列表">
            <!--form-->
            <el-card class="card-container">
              <el-form :model="roleForm">
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-form-item label="角色名称">
                      <el-input placeholder="请输入角色编码" v-model="roleForm.roleName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="角色编码">
                      <el-input
                        placeholder="请输入角色编码"
                        v-model="roleForm.rolePerm"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="9">
                    <el-form-item label="状态">
                      <el-select placeholder="请选择启动状态" v-model="roleForm.enabled">
                        <el-option
                          v-for="item in dicts.system_global_status"
                          :key="item.id"
                          :label="item.k"
                          :value="item.v"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-button icon="search" type="primary" @click="getRolePage">搜索</el-button>
                      <el-button icon="refreshLeft" @click="roleReset">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
            <!--table-->
            <el-card>
              <div class="toolbar">
                <el-button icon="plus" type="primary" @click="btnRoleDialog">新增</el-button>
              </div>
              <el-table :data="tableData" border>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="roleName" align="center" label="角色名称"></el-table-column>
                <el-table-column prop="rolePerm" align="center" label="权限字符"></el-table-column>
                <el-table-column label="是否启用" align="center">
                  <template #default="{ row }">
                    <el-tag>{{ row.enabled == '1' ? '启用' : '禁用' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  align="center"
                  label="创建时间"
                  :formatter="formatter"
                ></el-table-column>
                <el-table-column label="操作" align="center" width="220" fixed="right">
                  <template #default="{ row }">
                    <div class="sys-table-main-actions">
                      <el-link
                        icon="edit"
                        type="primary"
                        :underline="false"
                        @click="btnRoleDialog(row.id)"
                        >编辑</el-link
                      >
                      <el-link
                        icon="delete"
                        type="danger"
                        :underline="false"
                        style="margin: 0 8px"
                        @click="roleDel(row.id)"
                      >
                        删除
                      </el-link>
                      <router-link class="el-link el-link--error" type="success" to="/"
                        >分配用户</router-link
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页器 -->
              <pagination
                :total="totals"
                @update:current-page="handleCurrentPageUpdate"
                @update:page-size="handlePageSizeUpdate"
              >
              </pagination>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="回收站">回收站</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <role-dialog
      v-if="dialogVisible"
      v-model:dialogVisible="dialogVisible"
      @roleChange="getRolePage"
      :roleUpdateId="roleUpdateId"
    >
    </role-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeMount } from 'vue'
import { ref } from 'vue'
import { roleDelete, rolePage } from '@api/role'
import { Role } from '@interface/user'
import type { TableColumnCtx } from 'element-plus'
import tool from '@utils/tool'
import { ComponentInternalInstance } from 'vue'
import { dicts } from '@mixins/DIctsPlugin'
import RoleDialog from '@views/system/role/RoleDialog.vue'
// import pagination from '@components/pagination/index.vue'

const tableData = ref<Role[]>([])
const roleForm = ref({
  current: 1,
  size: 10,
  roleName: '',
  rolePerm: '',
  enabled: ''
})
const totals = ref(0)
onBeforeMount(() => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance
  if (proxy) {
    ;(proxy as any).getDicts(['system_global_status', 'system_global_gender'])
  }
  getRolePage()
})
const getRolePage = async () => {
  let res = await rolePage(roleForm.value)
  let { records, total } = res.data
  totals.value = total
  tableData.value = records
}

//时间戳转换为标准时间
const formatter = (row: Role, column: TableColumnCtx<Role>, timeValue: number) => {
  return tool.dateFormat(timeValue)
}

//重置
const roleReset = () => {
  roleForm.value = {
    current: 1,
    size: 10,
    roleName: '',
    rolePerm: '',
    enabled: ''
  }
  getRolePage()
}

//分页-页码
const handleCurrentPageUpdate = (page: number) => {
  roleForm.value.current = page
  getRolePage()
}
//分页-一页显示多少条
const handlePageSizeUpdate = (page: number) => {
  roleForm.value.size = page
  getRolePage()
}

//控制dialog显示
const dialogVisible = ref<boolean>(false)
const roleUpdateId = ref('')
//新增角色-按钮
const btnRoleDialog = (id: string) => {
  if (typeof id == 'string') {
    roleUpdateId.value = id
  } else {
    roleUpdateId.value = ''
  }
  dialogVisible.value = true
}

//删除角色
import { ElMessage, ElMessageBox } from 'element-plus'
const roleDel = (id: string) => {
  ElMessageBox.confirm('是否删除角色', {
    type: 'error',
    confirmButtonText: '删除'
  })
    .then(async () => {
      let res = await roleDelete(id)
      if (res.code != '200') return
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getRolePage()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
</script>

<style scoped less>
.card-container,
.toolbar {
  margin-bottom: 15px;
}
.el-table {
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: end;
  margin-top: 15px;
}
</style>
