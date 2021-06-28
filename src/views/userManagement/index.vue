<template>
  <div class="app-container">
    <el-card>
      <!-- 搜索和添加用户 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.UserName"
          :placeholder="$t('user.userName')"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
          @input="handleFilter"
        />
        <el-input
          v-model="listQuery.UserCode"
          :placeholder="$t('user.userCode')"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
          @input="handleFilter"
        />
        <el-select
          v-model="listQuery.GroupId"
          :placeholder="$t('user.userGroup')"
          clearable
          class="filter-item"
          style="width: 130px"
          @change="handleFilter"
        >
          <el-option
            v-for="item in userGroup"
            :key="item.GroupId"
            :label="item.GroupName"
            :value="item.GroupId"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          v-waves
          style="float:right;"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleAddUser"
        >{{$t('user.addUser')}}</el-button>
      </div>
      <!-- 用户列表 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        stripe
      >
        <el-table-column :label="$t('user.userName')" width="150px" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.UserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.userCode')" min-width="200px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.UserCode }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.email')" min-width="210px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Mail }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.userGroup')" width="150px" align="center">
          <template slot-scope="{row}">
            <el-tag v-for="item in row.Groups" :key="item" effect="plain">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.createUser')"  width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.CreateUser }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.createTime')" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.CreateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.lastLoginTime')" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.LastLoginTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.lastResetPwdTime')" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.LastResetPwd }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.isLocked')" width="100px" align="center">
          <template slot-scope="{row}">
            <span v-if="!row.editShow">{{ row.IsLocked==true ? "是":"否" }}</span>
            <svg-icon
              v-if="row.IsLocked==true&&row.editShow==false"
              icon-class="lock"
              style="color:red"
            />
            <svg-icon v-else-if="row.IsLocked==false&&row.editShow==false" icon-class="unlock" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="190">
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
              <el-button
                size="mini"
                type="warning"
                @click="handleReset(row)"
                icon="el-icon-refresh-left"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="success" @click="handleEdit(row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" @click="handleDelete(row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
      <!-- 删除用户对话框 -->
      <el-dialog title="警告" :visible.sync="deleteShow" :close-on-click-modal="false" width="30%">
        <span>确定要删除该用户吗?</span>
        <div slot="footer">
          <el-button @click="deleteShow = false">取 消</el-button>
          <el-button type="danger" @click="confirmDelete">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 重置密码对话框 -->
      <el-dialog
        title="警告"
        :visible.sync="resetPasswordShow"
        :close-on-click-modal="false"
        width="30%"
      >
        <span>该用户的密码将会重置为"123456"</span>
        <div slot="footer">
          <el-button @click="resetPasswordShow = false">取 消</el-button>
          <el-button type="danger" @click="confirmReset">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加用户对话框 用户信息保存到addUserForm中 -->
      <el-dialog
        :visible.sync="dialogPvVisible"
        title="添加新用户"
        width="450px"
        @close="addDialogClosed"
        :close-on-click-modal="false"
      >
        <div style="margin-top:10px">
          <label for>用户名:</label>
          <el-input placeholder="请输入用户名" v-model="addUserForm.UserName">
            <template slot="prepend">
              <i class="el-icon-user-solid"></i>
            </template>
          </el-input>
        </div>
        <div style="margin-top:10px">
          <label for>账号:</label>
          <el-input placeholder="请输入账号" v-model="addUserForm.NewUserCode">
            <template slot="prepend">
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </div>
        <div style="margin-top:10px">
          <label for>密码:</label>
          <el-input placeholder="请输入密码" v-model="addUserForm.PassWord">
            <template slot="prepend">
              <i class="el-icon-s-goods"></i>
            </template>
          </el-input>
        </div>
        <div style="margin-top:10px">
          <label for>邮箱:</label>
          <el-input placeholder="请输入邮箱" type="email" v-model="addUserForm.Mail">
            <template slot="prepend">
              <svg-icon iconClass="email"></svg-icon>
            </template>
          </el-input>
        </div>
        <span slot="footer">
          <el-button type="warning" @click="dialogPvVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户信息对话框 -->
      <el-dialog
        :visible.sync="dialogEditVisible"
        title="修改用户信息"
        width="450px"
        :close-on-click-modal="false"
        @close="edituserDialogClosed"
      >
        <div style="margin-top:10px">
          <label for>用户名:</label>
          <el-input placeholder="用户名" v-model="editUserForm.UserName">
            <template slot="prepend">
              <i class="el-icon-user-solid"></i>
            </template>
          </el-input>
        </div>
        <div style="margin-top:10px">
          <label for>账号:</label>
          <el-input placeholder="账号" v-model="editUserForm.NewUserCode" disabled>
            <template slot="prepend">
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </div>
        <div style="margin-top:10px">
          <label for>邮箱:</label>
          <el-input placeholder="邮箱" v-model="editUserForm.Mail">
            <template slot="prepend">
              <svg-icon iconClass="email"></svg-icon>
            </template>
          </el-input>
        </div>
        <!-- 是否锁定 -->
        <div style="display:flex;justify-content:space-between;">
          <div style="margin-top:10px;width:120px;">
            <label for>是否锁定:</label>
            <br />
            <el-switch
              v-model="editUserForm.IsLocked"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              style="margin-top:8px;"
            ></el-switch>
          </div>
        </div>
        <span slot="footer">
          <el-button type="warning" @click="edituserDialogClosed">取 消</el-button>
          <el-button type="primary" @click="edituser()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { debounce } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import md5 from "js-md5";
export default {
  name: "UserManagement",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      resetPasswordForm: {
        UserCode: this.$store.state.user.UserCode,
        OperateUserCode: "",
        OldPassWord: "forget",
        NewPassWord: "123456"
      },
      resetPasswordShow: false,
      editShow: false,
      deleteUserForm: {},
      deleteShow: false,
      addUserForm: {
        UserCode: this.$store.state.user.UserCode,
        NewUserCode: "",
        UserName: "",
        PassWord: "123456",
        Mail: ""
      },
      editUserForm: {
        UserCode: this.$store.state.user.UserCode,
        NewUserCode: "",
        UserName: "",
        IsLocked: false,
        Mail: ""
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        UserCode: "",
        UserName: "",
        page: 1,
        limit: 10,
        sort: 1
      },
      userGroup: [],
      // =================================================
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      dialogEditVisible: false,
      MailValid: false
    };
  },
  created() {
    this.getList();
    this.getUserGroup();
    // console.log(this.$store.state.user.UserCode);
  },
  methods: {
    throttle(func, delay) {
      console.log("throttle");
      let that = this;
      let now = +new Date();
      if (that.lastTime && that.lastTime - now < delay) {
        clearTimeout(that.timer);
      }
      that.timer = setTimeout(function() {
        console.log("发送请求");
        func.apply(this, arguments);
        that.lastTime = +new Date();
      }, 200);
    },
    debounce(func) {
      console.log("debounce");
      let that = this;
      if (that.timer) {
        clearTimeout(that.timer);
      }
      that.timer = setTimeout(function() {
        console.log("发送请求");
        func.apply(this);
        that.timer = undefined;
      }, 200);
    },
    getList() {
      this.listLoading = true;
      this.$axios({
        url: "/api/User/GetUserInfo",
        method: "GET",
        params: this.listQuery,
        timeout: 60000
      })
        .then(res => {
          this.list = res.data.ReturnObject.ViewList;
          // console.log(res.data, "res");
          this.list.map(item => {
            this.$set(item, "editShow", false);
          });
          // console.log(this.list, "thislist");
          this.total = res.data.ReturnObject.Total || 0;
          this.listLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleReset(row) {
      this.resetPasswordShow = true;
      this.resetPasswordForm.OperateUserCode = row.UserCode;
      console.log(this.resetPasswordForm);
    },
    confirmReset() {
      this.resetPasswordForm.NewPassWord = md5("123456");
      this.$axios
        .post("/api/User/ResetPassword", this.resetPasswordForm)
        .then(res => {
          if (res.data.ResultType == 0) {
            this.$notify({
              title: "成功",
              message: "重置成功",
              type: "success",
              duration: 2000
            });
            this.resetPasswordShow = false;
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message,
              duration: 2000
            });
            this.resetPasswordShow = false;
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "失败",
            message: "重置失败!",
            duration: 2000
          });
        });
    },
    adduser() {
      if (!this.addUserForm.UserName) {
        return this.$message.error("请输入用户名！");
      }
      if (!this.addUserForm.NewUserCode) {
        return this.$message.error("请输入账号！");
      }
      if (!this.addUserForm.PassWord) {
        return this.$message.error("请输入密码！");
      }
      if (this.addUserForm.Mail) {
        let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        this.MailValid = pattern.test(this.addUserForm.Mail);
        if (!this.MailValid) {
          return this.$message.error("请输入正确的邮箱！");
        }
      }
      this.addUserForm.PassWord = md5(this.addUserForm.PassWord);
      this.$axios
        .post("/api/User/AddUser", this.addUserForm)
        .then(res => {
          if (res.data.ResultType == 0) {
            // console.log(res.data);
            this.dialogPvVisible = false;
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
              duration: 2000
            });
            this.getList();
            this.resetForm();
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message,
              duration: 2000
            });
            this.resetForm();
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "失败",
            message: err.message,
            duration: 2000
          });
          console.log(err);
        });
    },
    handleEdit(row) {
      this.dialogEditVisible = true;
      this.editUserForm.NewUserCode = row.UserCode;
      this.editUserForm.UserName = row.UserName;
      this.editUserForm.IsLocked = row.IsLocked;
      this.editUserForm.Mail = row.Mail;
      console.log(row);
    },
    edituser() {
      if (!this.editUserForm.UserName) {
        return this.$message.error("请输入用户名！");
      }
      if (this.editUserForm.Mail) {
        let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        this.MailValid = pattern.test(this.editUserForm.Mail);
        if (!this.MailValid) {
          return this.$message.error("请输入正确的邮箱！");
        }
      }
      //发送post请求修改用户信息
      this.$axios
        .post("/api/User/UpdateUserInfo", this.editUserForm)
        .then(res => {
          if (res.data.ResultType == 0) {
            // console.log(res.data);
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
            this.dialogEditVisible = false;
            this.getList();
            this.resetForm();
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message,
              duration: 2000
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "失败",
            message: "修改失败",
            duration: 2000
          });
          console.log(err);
        });
    },
    edituserDialogClosed() {
      this.dialogEditVisible = false;
      this.resetForm();
    },
    getUserGroup() {
      this.$axios({
        url: "/api/Authority/GetGroupInfo",
        method: "GET"
      })
        .then(res => {
          this.userGroup = res.data.ReturnObject.ViewList;
        })
        .catch();
    },
    throttle1: function(func, delay) {
      let start = 0;
      return function() {
        console.log("throttle");
        const current = Date.now();
        if (current - start > delay) {
          console.log("发送请求");
          func.apply(this, arguments);
          start = current;
        }
      };
    },
    debounce1: function(func, delay) {
      // return function() {
      console.log("debounce");
      const that = this;
      const args = arguments;
      if (func.timeoutId) {
        clearTimeout(func.timeoutId);
      }
      func.timeoutId = setTimeout(() => {
        console.log("发送请求");
        func.apply(that, args);
        delete func.timeoutId;
      }, delay);
      // }
    },
    handleFilter() {
      // this.throttle1(this.getList, 1000);
      this.debounce1(this.getList, 1000);
      // this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetForm() {
      this.addUserForm = {
        UserCode: this.$store.state.user.UserCode,
        NewUserCode: "",
        UserName: "",
        PassWord: "123456",
        Mail: ""
      };
      this.deleteUserForm = {
        UserCode: "",
        NewUserCode: ""
      };
      this.editUserForm = {
        UserCode: this.$store.state.user.UserCode,
        NewUserCode: "",
        UserName: "",
        IsLocked: false,
        Mail: ""
      };
    },
    handleDelete(row) {
      this.deleteShow = true;
      this.deleteUserForm.UserCode = this.$store.state.user.UserCode;
      this.deleteUserForm.NewUserCode = row.UserCode;
      //   console.log(this.deleteUserForm);
    },
    confirmDelete() {
      this.$axios
        .post("/api/User/RemoveUser", this.deleteUserForm)
        .then(res => {
          if (res.data.ResultType == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.deleteShow = false;
            this.getList();
            // console.log(this.deleteUserForm);
          } else {
            this.$notify.error({
              message: res.data.Message,
              duration: 2000
            });
            this.deleteShow = false;
          }
        })
        .catch(err => {
          this.$notify.error({
            message: "删除失败!",
            duration: 2000
          });
          this.deleteShow = false;
        });
      this.resetForm();
    },
    addDialogClosed() {
      this.resetForm();
    },
    // 点击添加用户按钮
    handleAddUser() {
      this.dialogPvVisible = true;
    },
    validateMail(mail) {
      var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      this.MailValid = pattern.test(mail);
      if (!this.MailValid) {
        this.$message.error("请输入正确的邮箱！");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table .brand-row {
  background: green;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-icon-close {
  vertical-align: top;
  cursor: pointer;
}
.el-tag {
  margin-right: 5px;
  &:last-child {
    margin-right: 0px;
  }
}
</style>
