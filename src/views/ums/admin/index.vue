<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名或姓名">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="用户名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddUser()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.icon"></template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.email}}</p>
          </template>
        </el-table-column>
        <el-table-column label="帐号启用状态" align="center">
          <template slot-scope="scope">
              <el-switch
                @change="handleStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="最后登录时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.loginTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowPermissionDetail(scope.$index, scope.row)">编辑权限
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleShowRoles(scope.$index, scope.row)">编辑角色
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="warning"
                @click="handleResetPassword(scope.$index, scope.row)">重置密码
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleUpdateUser(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="'编辑'+editPermissionInfo.userName + '权限信息'"
      :visible.sync="editPermissionInfo.dialogVisible"
      width="40%">
      <el-tree
        show-checkbox
        node-key="id"
        ref="permissionTree"
        :default-expanded-keys="editPermissionInfo.selectedPermissionList"
        :default-checked-keys="editPermissionInfo.selectedPermissionList"
        :data="editPermissionInfo.allPermissionList"
        :props="editPermissionInfo.defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPermissionInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditPermissionConfirm(editPermissionInfo.userId)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑'+editRoleInfo.userName + '角色信息'"
      :visible.sync="editRoleInfo.dialogVisible"
      width="40%">
      <el-checkbox-group v-model="editRoleInfo.selectedRoleList" ref="roleList">
        <el-checkbox v-for="(role, index) in editRoleInfo.allRoleList" :label="role.id" :key="index">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRoleConfirm(editRoleInfo.userId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    updateStatus,
    fetchPermissionList,
    updatePermissions,
    resetPassword,
    fetchRoleList as fetchUserRoleList,
    updateRoleList
  } from '@/api/user'
  import {fetchTreeList} from '@/api/permission'
  import {fetchList as fetchRoleList} from '@/api/role'
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 5,
    status: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "adminList",
    data() {
      return {
        operates: [
          {
            label: "用户启用",
            value: "publishOn"
          },
          {
            label: "用户禁用",
            value: "publishOff"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        editPermissionInfo: {
          dialogVisible:false,
          userId: null,
          userName:'',
          selectedPermissionList:[],
          allPermissionList:[],
          defaultProps: {
              children: 'children',
              label: 'name'
          }
        },
        editRoleInfo: {
          dialogVisible:false,
          userId: null,
          userName:'',
          selectedRoleList:[],
          allRoleList:[],
          defaultProps: {
              children: 'children',
              label: 'name'
          }
        }
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddUser() {
        console.log('add')
      },
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的用户',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updateStatus(1,ids);
              break;
            case this.operates[1].value:
              this.updateStatus(0,ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1,ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0,ids);
              break;
            case this.operates[6].value:
              break;
            case this.operates[7].value:
              this.updateDeleteStatus(1,ids);
              break;
            default:
              break;
          }
          this.getList();
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateStatus(row.status, ids);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1,ids);
        });
      },
      handleUpdateUser(index,row){
        this.$router.push({path:'/pms/updateUser',query:{id:row.id}});
      },
      handleShowPermissionDetail(index,row){
        this.editPermissionInfo.dialogVisible=true;
        this.editPermissionInfo.userId=row.id;
        this.editPermissionInfo.userName=row.username;
        this.getPermissionTreeList()
        fetchPermissionList(row.id).then(response=>{
          this.editPermissionInfo.selectedPermissionList=response.data.map((x) =>x.id);
        });
      },
      getPermissionTreeList() {
        fetchTreeList().then(response => {
          let data = response.data;
          this.editPermissionInfo.allPermissionList = data;
        });
      },
      handleEditPermissionConfirm(userId){
        let tree = this.$refs.permissionTree;
        let params = new URLSearchParams();
        params.append('adminId', userId);
        params.append('permissionIds', tree.getCheckedKeys(true));
        updatePermissions(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.editPermissionInfo.dialogVisible=false;
        });
      },
      handleShowLog(index,row){
        console.log("handleShowLog",row);
      },
      handleResetPassword(index, row){
        resetPassword(row.id).then(response =>{
          this.$message({
            message: '重置密码成功!',
            type: 'success',
            duration: 1000
          });
        })
      },
      handleShowRoles(index, row){
        this.editRoleInfo.dialogVisible=true;
        this.editRoleInfo.userId=row.id;
        this.editRoleInfo.userName=row.username;
        fetchRoleList().then(response=>{
          console.log(response.data)
          this.editRoleInfo.allRoleList=response.data;
        });
        fetchUserRoleList(row.id).then(response=>{
          this.editRoleInfo.selectedRoleList=response.data.map((x) =>x.id);
        });
      },
      handleEditRoleConfirm(userId){
        let params = new URLSearchParams();
        params.append('adminId', userId);
        params.append('roleIds', this.editRoleInfo.selectedRoleList);
        updateRoleList(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.editRoleInfo.dialogVisible=false;
        });
      },
      updateStatus(status, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('status', status);
        updateStatus(params).then(response => {
          console.log(response)
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>
<style></style>
