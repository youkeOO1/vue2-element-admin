<template>
  <div class="app-container">
    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="65">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" align="center" width="180px">
        <template slot-scope="{ row }">
          <span>{{ row.display_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="300px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Author" align="center" width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Importance" width="11es0px">
        <template slot-scope="{ row }">
          <svg-icon
            v-for="item in row.importance"
            :key="item"
            icon-class="star"
            class="icon-star"
          />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{ row }">
          <span>{{ row.pageviews }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilters">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Drag" align="center" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>
    <div class="show-d"><el-tag>The default order :</el-tag> {{ oldList }}</div>
    <div class="show-d"><el-tag>The after dragging order :</el-tag> {{ newList }}</div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Sortable from 'sortablejs'

export default {
  filters: {
    statusFilters(status) {
      const statusMap = {
        draft: 'info',
        published: 'success',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      sortable: null,
      list: [],
      oldList: [],
      newList: [],
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      this.list = data.items
      this.oldList = data.items.map((item) => item.id)
      this.newList = data.items.map((item) => item.id)
      this.listLoading = false
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        onEnd: (evt) => {
          const dragItem = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, dragItem)

          const newListItem = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, newListItem)
        }
      })
    }
  }
}
</script>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
