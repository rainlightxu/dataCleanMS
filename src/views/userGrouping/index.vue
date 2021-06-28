<template>
  <div class="app-container">
    <el-card>
      <div class="UserGroupTable">
        <div class="tab-container" style="width:100%;float:left">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="AddUserDialog=true"
          >{{$t('userGroup.addUser2Group')}}</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="AddUserGroupDialog=true"
          >{{$t('userGroup.addGroup')}}</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-s-tools"
            @click="UpdateGroupDialog=true,getChangeGroupInfo()"
          >{{$t('userGroup.changeGroupAuth')}}</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-delete"
            @click="DeleteUserGroup"
          >{{$t('userGroup.removeGroup')}}</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-folder"
            @click="updateFilePermission"
          >{{$t('userGroup.updateFilePermission')}}</el-button>
          <!-- Tabs标签页 -->
          <el-tabs
            v-model="activeName"
            style="margin:20px 0;"
            type="border-card"
            v-loading="listLoading"
          >
            <el-tab-pane
              v-for="item in tabMapOptions"
              :key="item.GroupId"
              :label="item.GroupName"
              :name="item.GroupId.toString()"
            >
              <peopleInGroup
                v-if="activeName==item.GroupId"
                :type="item.GroupId.toString()"
                @create="tableSelectValue(item.GroupId)"
              ></peopleInGroup>

              <Group
                ref="MyTabPane"
                v-if="activeName==item.GroupId"
                :groupId="item.GroupId.toString()"
                @create="tableSelectValue(item.GroupId)"
                @getGroupPermissionInfo="getGroupPermissionInfo"
              />
              <!-- 添加用户到分组对话框 -->
              <keep-alive>
                <div v-if="activeName==item.GroupId">
                  <el-dialog
                    :close-on-click-modal="false"
                    :title="$t('userGroup.addUser2Group')"
                    :visible.sync="AddUserDialog"
                    width="500px"
                    append-to-body
                  >
                    <div>
                      <keep-alive>
                        <OutGroupUser
                          :type="item.GroupId.toString()"
                          @takeAddUserList="takeUserList"
                        ></OutGroupUser>
                      </keep-alive>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="AddUserDialog = false">取 消</el-button>
                      <el-button type="primary" @click="AddUser">确 定</el-button>
                    </span>
                  </el-dialog>
                </div>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
    <!-- 添加分组对话框 -->
    <el-dialog
      :title="$t('userGroup.addGroup')"
      :visible.sync="AddUserGroupDialog"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="AddUserGroupForm" label-width="120px">
        <el-form-item label="分组名称">
          <el-input v-model="AddUserGroupForm.GroupName" style="width:100%"></el-input>
        </el-form-item>
        <el-tree
          ref="AddGroupTree"
          :data="UserGroupList"
          show-checkbox
          node-key="ItemId"
          :default-expanded-keys="expanded"
          :props="AddUserGrouppProps"
          @check-change="handleCheckChange('create')"
        ></el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddUserGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="AddUserGroup(AddUserGroupForm);">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 更改用户分组权限弹框 -->
    <el-dialog
      :title="$t('userGroup.changeGroupAuth')"
      :visible.sync="UpdateGroupDialog"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="updateGroupForm" label-width="120px">
        <!-- <el-form-item label="Group Name">
                        <el-input v-model="updateGroupForm.GroupName" style="width:60%"></el-input>
        </el-form-item>-->
        <el-form-item label="页面名称">
          <el-tree
            ref="ChangeGroupTree"
            :data="UpdateUserGroupList"
            show-checkbox
            node-key="ItemId"
            :default-expanded-keys="expanded"
            :default-checked-keys="UpdateGroupselectedItem"
            :props="AddUserGrouppProps"
            @check-change="handleCheckChange('update')"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UpdateGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="UpdateGroup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除分组对话框 -->
    <el-dialog
      title="警告"
      :visible.sync="DeleteUserGroupDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <span>你确定要删除该分组吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeleteUserGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="ConfirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更改文件权限对话框 -->
    <file-permission :type="activeName" :visible="filePermissionDialog" @closeFilePermissionDialog='closeFilePermissionDialog'></file-permission>
  </div>
</template>

<script>
import Group from "./components/Group";
import PeopleInGroup from "./components/PeopleInGroup";
import OutGroupUser from "./components/OutGroupUser";
import FilePermission from "./components/FilePermission";
import axios from "axios";
import md5 from "js-md5";

export default {
  name: "Tab",
  components: { Group, PeopleInGroup, OutGroupUser,FilePermission },
  // inject: ["reload"],
  data() {
    return {
      expanded: [],
      AddUserGrouppProps: { children: "Child", label: "ItemName" },
      tempUserGroupInfo: [],
      tabMapOptions: [],
      activeName: "1",
      createdTimes: 0,
      listLoading: false,
      AddUserGroupDialog: false,
      UpdateGroupDialog: false,
      DeleteUserGroupDialog: false,
      AddUserDialog: false,
      AddUserGroupForm: {
        UserCode: this.$store.state.user.UserCode,
        GroupName: "",
        RoleList: []
      },
      UserGroupList: [],
      DeleteGroupForm: {
        GroupId: "",
        UserCode: this.$store.state.user.UserCode
      },
      AddUserForm: {
        UserCode: this.$store.state.user.UserCode,
        GroupId: "",
        GroupUserCodeList: []
      },
      UpdateUserGroupList: [],
      UpdateGroupselectedItem: [],
      updateGroupForm: {
        UserCode: this.$store.state.user.UserCode,
        GroupId: "",
        RoleList: []
      },
      filePermissionDialog:false
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    }
  },
  created() {
    // init the default  selected tab
    /* this.$router.push({
            query: { tab: "1" }
        }); */
    this.getGroups();
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
    this.getUserGroupInfo();
  },
  methods: {
    AddUserGroup(AddUserGroupForm) {
      // console.log(this.tabMapOptions, "grouplist数据");
      axios
        .post("/api/Authority/AddGroup", AddUserGroupForm)
        .then(res => {
          if (res.data.ResultType == 0) {
            this.$notify({
              title: "成功",
              message: "添加成功!",
              // duration: 2000,
              type: "success"
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.Message
              // duration: 2000
            });
          }
          this.getGroups();
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCheckChange(status) {
      if (status == "create") {
        console.log("create");
        let NodeTree = [];
        let checkNode = this.$refs.AddGroupTree.getCheckedNodes().concat(
          this.$refs.AddGroupTree.getHalfCheckedNodes()
        );
        checkNode.forEach(item => {
          NodeTree.push(item.ItemId);
        });
        this.AddUserGroupForm.RoleList = NodeTree;
        console.log(checkNode);
        console.log(NodeTree);
        return checkNode;
      } else {
        console.log("update");
        let NodeTree = [];
        var checkNode = this.$refs.ChangeGroupTree.getCheckedNodes().concat(
          this.$refs.ChangeGroupTree.getHalfCheckedNodes()
        );

        checkNode.forEach(item => {
          NodeTree.push(item.ItemId);
        });
        this.updateGroupForm.RoleList = NodeTree;
        console.log(checkNode);
        console.log(NodeTree);
        return checkNode;
      }
    },
    getUserGroupInfo() {
      this.$axios.get("/api/Authority/GetGroupAuthority").then(res => {
        this.UserGroupList = res.data.ReturnObject.ViewList;
        this.UserGroupList.forEach(item => {
          if (item.Child.length > 1) {
            this.expanded.push(item.ItemId);
          }
        });
        console.log(this.UserGroupList, "---userGroupAuthority");
      });
    },
    ChangeUpdateGroupInfo(GroupId, GroupName) {
      this.updateGroupForm.GroupId = GroupId;
      this.updateGroupForm.GroupName = GroupName;
      // console.log(GroupId, GroupName, "id--------------Name");
    },
    /* TellTabPaneEmit() {
            this.$refs.MyTabPane[0].emitGroupPermissionInfo();
        }, */

    getGroupPermissionInfo(val) {
      /* this.$refs.mychild.parentHandleclick("发射数据"); */
      this.updateGroupForm = Object.assign(this.updateGroupForm, val);
      // console.log(this.updateGroupForm, "updateGroupInfo");
    },
    getChangeGroupInfo() {
      console.log(this.$route);
      this.$axios({
        url: "/api/Authority/GetGroupAuthority",
        method: "GET",
        params: { GroupId: this.$route.query.tab || 1 }
      }).then(res => {
        this.UpdateUserGroupList = [];
        this.UpdateGroupselectedItem = [];
        this.UpdateUserGroupList = res.data.ReturnObject.ViewList;
        this.UpdateUserGroupList.forEach(item => {
          /*  if (item.IsValid == true) {
                        this.UpdateGroupselectedItem.push(item.ItemId);
                    } */
          item.Child.forEach(item => {
            if (item.IsValid == true) {
              this.UpdateGroupselectedItem.push(item.ItemId);
            }
          });
        });
        console.log(this.UpdateUserGroupList);
      });
      console.log(this.UpdateUserGroupList);
    },
    UpdateGroup() {
      this.updateGroupForm.GroupId = this.$route.query.tab || 1;
      this.$axios
        .post("/api/Authority/UpdateGroupAuthority", this.updateGroupForm)
        .then(res => {
          this.getGroups();
          if (res.data.ResultType == 0) {
            this.$notify({
              type: "success",
              title: "成功",
              message: "更新成功!"
              // duration: 2000
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.$notify.error({
              title: "Error",
              message: res.data.Message
              // duration: 2000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    takeUserList(val) {
      // console.log(val, "take To Here list?");
      this.AddUserForm.GroupUserCodeList = val;
      this.AddUserForm.GroupId = this.activeName;
    },
    AddUser() {
      this.listLoading = true;
      axios
        .post("/api/Authority/AddGroupUser", this.AddUserForm)
        .then(res => {
          // this.getList();
          // console.log(this.res.data, "添加用户返回的信息");
          // console.log(this.list, "添加用户返回的信息");
          if (res.data.ResultType == 0) {
            this.$notify({
              type: "success",
              title: "成功",
              message: "添加成功!"
              // duration: 2000
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          if (res.data.ResultType == 1) {
            this.$notify.error({
              title: "Error",
              message: res.data.Message
              // duration: 2000
            });
          }
          this.listLoading = false;
          // this.AddUserDialog = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    ConfirmDelete() {
      // console.log(this.DeleteGroupForm, "DeleteGroupForm?------------");
      axios
        .post("/api/Authority/RemoveGroup", this.DeleteGroupForm)
        .then(res => {
          // console.log(res.data, "---------------");
          // console.log(this.tabMapOptions, "grouplist数据");
          this.DeleteUserGroupDialog = false;
          this.$router.push(`${this.$route.path}?tab=${"1"}`);
          if (res.data.ResultType == 0) {
            this.$notify({
              type: "success",
              title: "成功!",
              message: "刪除成功"
              // duration: 2000
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message
              // duration: 2000
            });
          }
          this.getGroups();
        })
        .catch(err => {
          console.log(err);
        });
    },
    DeleteUserGroup() {
      // console.log(this.activeName, "activename???????");
      this.DeleteUserGroupDialog = true;
      this.DeleteGroupForm.GroupId = this.activeName;
    },

    tableSelectValue(GroupId) {
      /* this.createdTimes = this.createdTimes + 1;
            axios
                .get("/api/Authority/GetGroupAuthority", {
                    params: { GroupId: GroupId }
                })
                .then(res => {
                    // console.log(res.data, "当前组的list数据");
                    if (res.data.ResultType == 1) {
                        this.$notify.error({
                            title: "Error",
                            message: this.$t(`permission.${res.data.Message}`),
                            duration: 2000
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                }); */
    },
    getGroups() {
      this.listLoading = true;
      axios
        .get("/api/Authority/GetGroupInfo")
        .then(res => {
          this.tabMapOptions = res.data.ReturnObject.ViewList;
          console.log(this.tabMapOptions, "---grouplist");
          if (res.data.ResultType == 1) {
            this.$notify.error({
              title: "Error",
              message: res.data.Message
              // duration: 2000
            });
          }
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateFilePermission() {
      this.filePermissionDialog = true
    },
    closeFilePermissionDialog() {
      this.filePermissionDialog = false
    }
  }
};
</script>
<style lang="scss">
@media only screen and(max-width: 950px) {
  .el-dialog {
    width: 100% !important;
  }
  .UserGroupTable .el-input {
    width: 80% !important;
  }
}
@media only screen and(max-width: 950px) {
  .UserGroupTable .GroupTable {
    width: 100% !important;
    margin-right: 0px !important;
  }
  .UserGroupTable .tab-container > .el-button {
    margin-top: 10px;
    width: 48% !important;
    margin-left: 0 !important;
  }
}
</style>
