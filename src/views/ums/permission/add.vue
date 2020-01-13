<template> 
  <permission-detail :is-edit='false'></permission-detail>
</template>
<script>
  import PermissionDetail from './components/Permission'
  export default {
    name: 'addPermission',
    components: { PermissionDetail }
  }
</script>
<style>
</style>
