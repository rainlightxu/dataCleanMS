<template>
  <div class="navbar">
    <div class="header-title-container">
      <i class="el-icon-s-unfold hidden" @click="toggleSideBar" />
      <div class="header-title">{{ title }}</div>
    </div>
    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
          <search id="header-search" class="right-menu-item" />

          <error-log class="errLog-container right-menu-item hover-effect" />

          <screenfull id="screenfull" class="right-menu-item hover-effect" />

          <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
            <size-select id="size-select" class="right-menu-item hover-effect" />
          </el-tooltip>


          <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
            <theme class="right-menu-item hover-effect"></theme>
          </el-tooltip>
      </template>-->

      <lang-select
        v-show="UserCode === 'Admin'"
        class="right-menu-item hover-effect"
      ></lang-select>

      <span class="username">{{ UserName }}</span>
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <!-- <el-avatar
            style="background-color: #1890ff"
            icon="el-icon-user-solid"
          ></el-avatar> -->
          <i class="el-icon-s-custom" style="font-size: 25px"></i>
          <!-- <img src="@/assets/logo-light.png" class="user-avatar" /> -->
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
              <el-dropdown-item>{{$t('navbar.profile')}}</el-dropdown-item>
          </router-link>-->
          <router-link to="/">
            <el-dropdown-item>{{ $t("navbar.dashboard") }}</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>-->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="changePassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="changePasswordDialog" :modal="false" top="30vh">
      <el-form
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        ref="changePasswordFormRef"
        label-width="120px"
      >
        <el-form-item prop="UserCode" label="账号">
          <el-input
            v-model="changePasswordForm.UserCode"
            disabled
            autocomplete="off"
            style="width: 85%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="OldPassword" label="旧密码">
          <el-input
            v-model="changePasswordForm.OldPassword"
            type="password"
            autocomplete="off"
            style="width: 85%"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="NewPassword" label="新密码">
          <el-input
            v-model="changePasswordForm.NewPassword"
            type="password"
            autocomplete="off"
            style="width: 85%"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changePasswordDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmChangePassword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import LangSelect from "@/components/LangSelect";
import Theme from "@/components/ThemePicker";
import Hamburger from "@/components/Hamburger";
import md5 from "js-md5";

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
};

export default {
  components: {
    Screenfull,
    ErrorLog,
    SizeSelect,
    Search,
    LangSelect,
    Theme,
    Hamburger,
  },
  data() {
    return {
      UserName: "",
      group: "",
      groups: [],
      title: "",
      changePasswordDialog: false,
      changePasswordForm: {
        UserCode: "",
        OldPassword: "",
        NewPassword: "",
      },
      changePasswordFormRules: {
        OldPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
        NewPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
    };
  },
  created() {
    this.UserName = JSON.parse(
      window.sessionStorage.getItem("userInfo")
    ).UserName;
    this.getGroups();
    // import('../../../public/serverConfig.json').then(res => {
    //   console.log(res)
    // })
    this.$getServerConfig()
      .then((res) => {
        this.title = res.data.title;
      })
      .catch((err) => {
        this.title = "Big Data Clean Platform";
      });
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "UserCode"]),
    ...mapState({
      UserCode: (state) => state.user.UserCode,
    }),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");

      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    getGroups() {},
    changePassword() {
      this.changePasswordForm.UserCode = this.UserCode;
      this.changePasswordDialog = true;
    },
    confirmChangePassword() {
        this.$refs.changePasswordFormRef.validate(async (valid) => {
          if (valid) {
            let postForm = {}
            postForm.UserCode = this.changePasswordForm.UserCode
            postForm.OldPassword = md5(
              this.changePasswordForm.OldPassword
            );
            postForm.NewPassword = md5(
              this.changePasswordForm.NewPassword
            );
            this.$axios
              .post("/api/User/ChangePassword", postForm)
              .then((res) => {
                if (res.data.ResultType === '0') {
                  this.$notify({
                    title: "成功",
                    message: "修改密码成功, 请重新登录",
                    type: "success",
                    duration: 2000,
                  });
                  this.$refs.changePasswordFormRef.resetFields();
                  this.changePasswordDialog = false;
                  setTimeout(() => {
                    this.logout()
                  }, 200);
                } else {
                  this.$notify({
                    title: "失败",
                    message: "修改密码失败,",
                    type: "error",
                    duration: 2000,
                  });
                }
              });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;

  .right-menu {
    display: flex;
    align-items: center;
    // float: right;
    // height: 100%;
    line-height: 58px;

    &:focus {
      outline: none;
    }
    .username {
      margin: 0 10px 0 10px;
      font-weight: 600;
      font-size: 18px;
    }
    .right-menu-item {
      display: inline-block;
      // display: flex;
      // align-items: center;
      padding: 0 20px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        // background-color: #005c90;
        border-radius: 10px;
        padding: 2px;
        width: 45px;
        height: 45px;
        position: relative;
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .header-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-s-unfold {
      cursor: pointer;
      margin: 0 10px;
      font-size: 18px;
    }
  }
  .header-title {
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    color: #005c90;

    margin-left: 10px;
  }
}
/deep/ .el-dialog__wrapper {
  z-index: 1 !important;
}
/deep/ .v-modal {
  z-index: 1 !important;
}
.el-dropdown-menu .el-popper .el-dropdown-menu--medium {
  transform-origin: center top;
  z-index: 2003;
  position: fixed;
  top: 64px;
  left: 1770px !important;
}
@media screen and (min-width: 992px) {
  .header-title {
    font-size: 40px;
  }
  .hidden {
    display: none;
  }
}
@media screen and (max-width: 992px) {
  .header-title {
    font-size: 30px;
  }
  .hidden {
    display: block;
  }
}
@media screen and (max-width: 768px) {
  .header-title {
    font-size: 20px;
  }
  .hidden {
    display: block;
  }
}
@media screen and (max-width: 767px) {
  .header-title {
    font-size: 16px;
    display: none;
  }
  .hidden {
    display: block;
  }
}
</style>
