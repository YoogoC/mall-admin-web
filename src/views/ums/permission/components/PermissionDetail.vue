<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="permission" :rules="rules" ref="permissionFrom" label-width="150px">
      <el-form-item label="名称:" prop="name">
        <el-input v-model="permission.name"></el-input>
      </el-form-item>
      <el-form-item label="父级资源:">
        <el-cascader
          v-model="permission.pid"
          :options="permissionOptions"
          clearable
          :props="{checkStrictly: true}"></el-cascader>
      </el-form-item>
      <el-form-item label="权限值:">
        <el-input v-model="permission.value"></el-input>
      </el-form-item>
      <el-form-item label="图标:">
        <el-input v-model="permission.icon"></el-input>
      </el-form-item>
      <el-form-item label="权限类型:">
        <el-radio-group v-model="permission.type">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="前端资源路径:">
        <el-input v-model="permission.uri"></el-input>
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="permission.sort" type="number"></el-input>
      </el-form-item>
      <el-form-item label="启用状态:" prop="sort">
        <el-radio-group v-model="permission.status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('permissionFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('permissionFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createPermission, getPermission, updatePermission, fetchTreeList} from '@/api/permission'
  import SingleUpload from '@/components/Upload/singleUpload'
  const defaultPermission={
    name: '',
    value: '',
    icon: '',
    type: '',
    uri: '',
    pid: 0,
    status: 0,
    sort: 0
  };
  export default {
    name: 'PermissionDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        permission:Object.assign({}, defaultPermission),
        rules: {
          name: [
            {required: true, message: '请输入权限名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          logo: [
            {required: true, message: '请输入品牌logo', trigger: 'blur'}
          ],
          sort: [
            {type: 'number', message: '排序必须为数字'}
          ],
        },
        permissionOptions: []
      }
    },
    created() {
      this.getPermissionTreeList()
      if (this.isEdit) {
        getPermission(this.$route.query.id).then(response => {
          this.permission = response.data;
        });
      }else{
        this.permission = Object.assign({},defaultPermission);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updatePermission(this.$route.query.id, this.permission).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                console.log(this.permission)
                this.permission.pid = this.permission.pid[0]
                createPermission(this.permission).then(response => {
                  this.$refs[formName].resetFields();
                  this.permission = Object.assign({},defaultPermission);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.permission = Object.assign({},defaultPermission);
      },
      getPermissionTreeList() {
        fetchTreeList().then(response => {
          var data = response.data
          this.permissionOptions = [{value: 0, label: '系统', children: this.formatPermissionTreeList(data)}]
        });
      },
      formatPermissionTreeList(nodes) {
        if (nodes.length > 0) {
          return nodes.map((x) => ({value: x.id, label: x.name, children: this.formatPermissionTreeList(x.children)}))
        }
      }
    }
  }
</script>
<style>
</style>
