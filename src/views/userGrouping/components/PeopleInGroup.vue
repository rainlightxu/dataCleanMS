<template>
  <div style="width: 60%;display:inline-block;">

    <div>
      <h4 style="display:inline-block;">{{$t('userGroup.userInGroup')}}</h4>
      <el-button style="float:right;margin-top:10px;" type="danger" @click="handleDeleteUser">{{$t('userGroup.batchRemoveUser')}}</el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      max-height="500"
      v-loading="listLoading"
      class="IngroupUserTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column min-width="100" align="left" :label="$t('user.userName')">
        <template slot-scope="scope">
          <span>{{ scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="left" :label="$t('user.userCode')">
        <template slot-scope="scope">
          <span>{{ scope.row.UserCode}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="100" align="center" label="Operations">
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        size="small"
                        icon="el-icon-delete-solid"
                        :disabled="batchRemoveShow"
                        @click="handleDeleteUser(scope.row.UserCode)"
                    >删除</el-button>
                </template>
      </el-table-column>-->

      <el-dialog
        title="警告！"
        :visible.sync="DeleteUserDialog"
        width="30%"
        center
        append-to-body
        :close-on-click-modal="false"
      >
        <span>你確定要刪除已選擇用戶嗎？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DeleteUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmBatchRemove" :loading="batchRemoveLoading">確 定</el-button>
        </span>
      </el-dialog>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  props: {
    type: {
      type: String,
      default: "1"
    },
  },
  data() {
    return {
      batchRemoveLoading: false,
      batchRemoveShow: false,
      singleDeleteShow: false,
      listLoading: false,
      DeleteUserDialog: false,
      list: null,
      loading: false,
      DeleteUserForm: {
        UserCode: this.$store.state.user.UserCode,
        GroupId: this.type,
        GroupUserCodeList: []
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    cancelSingleDelete() {
      this.singleDeleteShow = false;
      this.DeleteUserDialog = false;
      this.DeleteUserForm.GroupUserCodeList = [];
    },
    handleDeleteUser() {
      if (this.DeleteUserForm.GroupUserCodeList.length !== 0) {
        //删除数组GroupUserCodeList不为空
        this.DeleteUserDialog = true;
      } else {
          this.$message({
          showClose: true,
          message: "請選擇要刪除的用戶!",
          type: "error"
        });
      }
    },
    /* handleBatchRemove() {
            this.batchRemoveShow = !this.batchRemoveShow;
        }, */
    handleSelectionChange(val) {
      // console.log(val);
      this.DeleteUserForm.GroupUserCodeList = [];
      for (let i = 0; i < val.length; i++) {
        this.DeleteUserForm.GroupUserCodeList.push(val[i].UserCode);
      }
      // console.log(
      //     this.DeleteUserForm.GroupUserCodeList,
      //     "this.DeleteUserForm.GroupUserCodeList"
      // );
    },
    confirmBatchRemove() {
    //   if (this.DeleteUserForm.GroupUserCodeList.length > 0) {
        this.batchRemoveLoading = true;
        this.$axios
          .post("/api/Authority/RemoveGroupUser", this.DeleteUserForm)
          .then(res => {
            if (res.data.ResultType == 0) {
              this.batchRemoveShow = false;
              this.DeleteUserForm.GroupUserCodeList = [];
              this.batchRemoveLoading = false;
              this.singleDeleteShow = false;
              this.DeleteUserDialog = false;
              this.$notify({
                title: "成功",
                message: "刪除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            } else {
              this.batchRemoveShow = false;
              this.DeleteUserForm.GroupUserCodeList = [];
              this.batchRemoveLoading = false;
              this.singleDeleteShow = false;
              this.DeleteUserDialog = false;
              this.$notify.error({
                title: "失敗",
                message: res.data.Message,
                duration: 2000
              });
            }
          })
          .catch();
    //   } else {
    //     this.$message({
    //       showClose: true,
    //       message: "请先选择您要删除成员!",
    //       type: "error"
    //     });
    //   }
    },
    handleSingleDelete(SkuCode) {
      this.singleDeleteShow = true;
      // console.log(this.DeleteUserForm.GroupUserCodeList);
      this.DeleteUserForm.GroupUserCodeList.push(SkuCode);
      // console.log(this.DeleteUserForm.GroupUserCodeList);
    },

    getList() {
      this.listLoading = true;
      axios
        .get("/api/Authority/GetGroupUser", {
          params: { GroupId: this.type }
        })
        .then(res => {
          this.list = res.data.ReturnObject.ViewList;
          this.total = res.data.ReturnObject.Total;
          // console.log(this.list, "当前权限组的userInfo");
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
          //console.log(this);
        });
    }
  }
};
</script>
<style lang="scss">
@media only screen and(max-width: 950px) {
  .IngroupUserTable {
    width: 100% !important;
    margin-right: 0px !important;
  }
}
</style>

