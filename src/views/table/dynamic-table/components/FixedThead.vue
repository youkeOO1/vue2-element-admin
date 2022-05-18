<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="apple"> apple </el-checkbox>
        <el-checkbox label="banana"> banana </el-checkbox>
        <el-checkbox label="orange"> orange </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180" />
      <el-table-column v-for="item in formThead" :key="item" :label="item">
        <template slot-scope="scope">
          {{ scope.row[item] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const defaultFormThead = ['apple', 'banana']

export default {
  data() {
    return {
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],
      key: 1,
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkList: defaultFormThead,
      formThead: defaultFormThead
    }
  },
  watch: {
    checkList(newVal) {
      console.log('watch')
      this.formThead = this.formTheadOptions.filter((item) => newVal.indexOf(item) > -1)
      this.key += 1
    }
  }
}
</script>

<style>

</style>
