<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope)"> Edit </el-button>
          <el-button type="danger" @click="handleDelete(scope)"> Delete </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'">
      <el-form :model="form">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="Menu">
          <el-tree
            ref="tree"
            :data="routesData"
            :check-strictly="checkStrictly"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { getRoutes, getRoles, addRole, updateRole, deleteRole } from '@/api/role'
import { deepClone } from '@/utils/deepClone'

const defaultForm = {
  id: '',
  name: '',
  description: ''
}

export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      dialogType: 'edit',
      form: Object.assign({}, defaultForm),
      routes: [],
      serviceRoutes: [],
      checkStrictly: false,
      defaultProps: {
        label: 'title',
        children: 'children'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoute()
    this.getRoles()
  },
  methods: {
    /**
     * 获取路由
     */
    async getRoute() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    /**
     * 获取用户
     */
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    /**
     * 生成 el-tree 所需要的路由数据
     */
    generateRoutes(routes, basePath = '/') {
      // 隐藏路由跳过
      // 只有一个路由，
      // 多个路由
      const res = []
      for (let route of routes) {
        if (route.hidden) {
          continue
        }
        //  只有一个子路由 or 没有子路由时生成符合规则的数据
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          // 只有一个子路由，或者没有子路由的路由数据
          route = onlyOneShowingChild
        }

        const dataObj = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }
        if (route.children) {
          dataObj.children = this.generateRoutes(route.children, route.path)
        }
        res.push(dataObj)
      }
      return res
    },
    /**
     * 只有一个子路由 or 没有子路由的 数据展示
     */
    onlyOneShowingChild(childrenArr = [], parent) {
      // 对子路由过滤，去掉隐藏路由
      let onlyOneChild = null
      const showChild = childrenArr.filter((ele) => !ele.hidden)

      if (showChild.length === 1) {
        // 只有一个路由，展示子路由信息，不去展示父级路由
        onlyOneChild = showChild[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }
      if (showChild.length === 0) {
        // 没有子路由，展示父级路由的信息
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    /**
     * 当前选中子节点的数组,
     */
    generateArr(routes = []) {
      let res = []
      routes.forEach((route) => {
        res.push(route)
        if (route.children) {
          const chil = this.generateArr(route.children)
          if (chil.length > 0) {
            res = [...res, ...chil]
          }
        }
      })
      return res
    },
    /**
     * 生成路由树
     */
    generateTree(routes = [], basePath, keys = []) {
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)
        if (route.children) {
          // 递归子组件
          route.children = this.generateTree(route.children, routePath, keys)
        }
        if (keys.includes(routePath) || (route.children && route.children.length >= 1)) {
          // 选中的路由
          // checkedKeys.includes(routePath) 当前选中的路由
          // (route.children && route.children.length >= 1) 当前路由的子路由超过一个被选中
          res.push(route)
        }
      }
      return res
    },
    /**
     * 添加角色
     */
    handleAddRole() {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.form = Object.assign({}, defaultForm)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
    },
    /**
     * 修改数据
     */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.form = deepClone(scope.row)
      this.$nextTick(() => {
        // 将权限路由进行数据格式化
        const routes = this.generateRoutes(this.form.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        this.checkStrictly = false
      })
    },
    /**
     * 删除用户
     */
    handleDelete({ $index, row }) {
      this.dialogType = 'edit'
      this.dialogVisible = false
      this.$confirm('Confirm to remove the role?', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        await deleteRole(row.key)
        this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: 'Delete succed!'
        })
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: err
        })
      })
    },
    /**
     * 提交修改
     */
    async confirmRole() {
      // 生成路由树
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取新的选中路由树
      this.form.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        // 是修改 role
        // 发送请求
        await updateRole(this.form.key, this.form)
        // 修改数据
        for (let i = 0; i < this.rolesList.length; i++) {
          if (this.rolesList[i].key === this.form.key) {
            // 修改对应的数据
            this.rolesList.splice(i, 1, Object.assign({}, this.form))
            break
          }
        }
      } else {
        // 添加 role
        // 发送数据
        const { data } = await addRole(this.form)
        this.form.key = data.key
        // 添加数据
        this.rolesList.push(this.form)
      }
      this.dialogVisible = false
      const { key, name, description } = this.form
      // 通知
      this.$notify({
        title: 'success',
        dangerouslyUseHTMLString: true,
        message: `
        <div>Role Key:${key}</div>
        <div>Role Name:${name}</div>
        <div>Description:${description}</div>
        `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 15px;
    .permission-tree {
      margin-bottom: 30px;
      margin-left: 80px;
    }
  }
</style>
