<template>
  <div class="app-container">
    <switch-roles @change="handleChange" />
    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          Only
          <el-tag class="permission-tag">Admin</el-tag>
          can see this
        </span>
        <el-tag v-permission="['admin']" class="permission-sourceCode" type="info">v-permission="['admin']"</el-tag>
      </div>
      <div>
        <span v-permission="['editor']" class="permission-alert">
          Only
          <el-tag class="permission-tag">Editor</el-tag>
          can see this
        </span>
        <el-tag v-permission="['editor']" class="permission-sourceCode" type="info">v-permission="['Edit']"</el-tag>
      </div>
      <div>
        <span v-permission="['admin', 'editor']" class="permission-alert">
          Both
          <el-tag class="permission-tag">Admin</el-tag> and
          <el-tag class="permission-tag">Editor</el-tag>
          can see this
        </span>
        <el-tag v-permission="['admin', 'editor']" class="permission-sourceCode" type="info">v-permission="['admin', 'Edit']"</el-tag>
      </div>
    </div>
    <div :key="'checkPermission' + key" style="margin-top:60px;">
      <aside>
        In some cases, using v-permission will have no effect. For example: Element-UI's Tab component or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.
        <br> e.g.
      </aside>
      <el-tabs type="border-card">
        <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">
          Admin can see this
          <el-tag type="info" class="permission-sourceCode">v-if="checkPermission(['admin'])"</el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['editor'])" label="Editor">
          Editor can see this
          <el-tag type="info" class="permission-sourceCode">v-if="checkPermission(['editor'])"</el-tag>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['admin', 'editor'])" label="Admin-OR-Editor">
          Both admin or editor can see this
          <el-tag type="info" class="permission-sourceCode">v-if="checkPermission(['admin','editor'])"</el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles.vue'
import permission from '@/directive/permission/index'
import checkPermission from '@/utils/permission'

export default {
  components: {
    SwitchRoles
  },
  directives: {
    permission
  },
  data() {
    return {
      key: 0
    }
  },
  methods: {
    checkPermission,
    handleChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 20px;
    .permission-alert {
      width: 320px;
      margin-top: 15px;
      background-color: #f0f9eb;
      color: #67c23a;
      padding: 8px 16px;
      display: inline-block;
      border-radius: 4px;
    }
    .permission-sourceCode {
      margin-left: 14px;
    }
  }
</style>
