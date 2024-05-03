<template>
    <el-dialog
        v-model="props.subjectVisible"
        title="选择科目"
        width="800" 
        @close="close"
    >   
        <div>
            <el-row :gutter="15">
                <el-col :span="8">
                    <el-input v-model='searchForm.subjectName' placeholder="输入科目名称"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-input v-model='searchForm.gradeName' placeholder="输入等级名称"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="margin-top: 15px;" @selection-change="handleSelectionChange">
            <el-table-column width="50" type="selection"></el-table-column>
            <el-table-column label="科目名称" prop="subjectName"></el-table-column>
            <el-table-column label="等级名称" prop="gradeName"></el-table-column>
            <el-table-column label="学费标准" prop="amount"></el-table-column>
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
import { ref , reactive , onBeforeMount } from 'vue'
import { gradeList , IGradeListItem , IGradeList } from '@api/teachSubjectGrade'
const props = defineProps({
    subjectVisible:{
        type:Boolean,
        default:false
    },
})
//搜索数据
let searchForm = reactive<IGradeList>({
    current:1,
    size:10,
    subjectName:'',
    gradeName:''
})
//table数据
let tableData = ref<IGradeListItem[]>([]);
//生命周期
onBeforeMount(async ()=>{
    //列表数据
    getGradeList();
})  
//获取列表数据
const getGradeList = async ()=>{
    let res = await gradeList(searchForm);
    let { records } = res.data;
    tableData.value = records;

}
//选择数据
let sname = reactive<any>({});
const handleSelectionChange = ( val:IGradeListItem[] )=>{
    sname = val.pop();
}
//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:subjectVisible',false);
}

//保存
const onSubmit = async ()=>{
    emit('chooseSubject',sname);
    close();
}

</script>
