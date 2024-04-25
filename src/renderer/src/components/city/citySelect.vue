<template>
  <div class="main">
    <el-row :gutter="15">
      <el-col :span="8">
        <el-select @change="handleProvinces" placeholder="省" v-model="currentProvinces">
          <el-option
            v-for="item in provinces"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <el-select @change="handleCity" placeholder="市" v-model="currentCity">
          <el-option
            v-for="item in city"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <el-select @change="handleLocation" placeholder="县/区" v-model="currentCounties">
          <el-option
            v-for="item in counties"
            :key="item.id"
            :label="item.areaName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, handleError } from 'vue'
import { getAreaByParentId, IGetAreaByParentId } from '@api/location'
import { ILocation } from '@interface/location'
const emits = defineEmits()
//省
let provinces = ref<IGetAreaByParentId[]>([])
let currentProvinces = ref<string>('')
//市
let city = ref<IGetAreaByParentId[]>([])
let currentCity = ref<string>('')
//县/区
let counties = ref<IGetAreaByParentId[]>([])
let currentCounties = ref<string>('')

onBeforeMount(async () => {
  provinces.value = await getAreaByParent('1')
})
const getAreaByParent = async (id: string): Promise<IGetAreaByParentId[]> => {
  let res = await getAreaByParentId({
    parentId: id
  })
  return res.data
}

//一级修改
const handleProvinces = async (id: string) => {
  currentProvinces.value = id
  city.value = await getAreaByParent(id)
}
//二级修改
const handleCity = async (id: string) => {
  currentCity.value = id
  counties.value = await getAreaByParent(id)
}
//三级选择
const handleLocation = async (id: string) => {
  currentCounties.value = id
  let data: ILocation = {
    province: currentProvinces.value,
    city: currentCity.value,
    county: currentCounties.value
  }
  emits('Location', data)
}
</script>

<style scoped>
.main {
  min-width: 450px;
}
</style>
