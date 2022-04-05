<template>
  <div class="app-container">
    <switch-roles @change="handleChange" />
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles.vue'

export default {
  components: {
    SwitchRoles
  },
  methods: {
    handleChange() {
      this.$router.push({ path: '/permission' })
    }
  }
}
</script>
