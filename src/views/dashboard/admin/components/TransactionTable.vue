<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200" align="center">
      <template v-slot:default="slotProps">
        {{ slotProps.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Price" min-width="195" align="center">
      <template v-slot:default="slotProps">
        ¥{{ slotProps.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Status" min-width="100" align="center">
      <template v-slot:default="slotProps">
        <el-tag :type="slotProps.row.status | statusFilter">
          {{ slotProps.row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    orderNoFilter(str) {
      return str.substring(0, 30)
    },
    statusFilter(state) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[state]
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取数据
     */
    fetchData() {
      transactionList().then((res) => {
        this.list = res.data.items.slice(0, 8)
      })
    }
  }
}
</script>

<style>

</style>
