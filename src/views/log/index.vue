<template>
  <div class="app-container">
    <el-card>
      <!-- 搜索 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.OperatorName"
          placeholder="操作人姓名"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.Operation"
          placeholder="操作"
          style="width: 200px;"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.StartDate"
          placeholder="开始日期"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="handleFilter"
        ></el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="listQuery.EndDate"
          placeholder="结束日期"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="handleFilter"
        ></el-date-picker>
        <el-select
          v-model="listQuery.Result"
          :placeholder="$t('log.resultStatus')"
          clearable
          class="filter-item"
          style="width: 130px"
          @change="handleFilter"
        >
          <el-option label="成功" value="成功" />
          <el-option label="失敗" value="失敗" />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
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
        <el-table-column :label="$t('log.operation')" width="200px" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row.Operation }}</span>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('log.operatorName')" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OperatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.operatorParams')" prop="ParamsArr" min-width="200px" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- <el-tag v-for="item in row.Groups" :key="item" effect="plain">{{ item }}</el-tag> -->
            <el-tag class="params" type="info" v-for="(item,index) in row.ParamsArr" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.operationTime')" prop="CreateTime" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OperationTime | formatDate}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('log.resultStatus')" min-width="100px" align="center">
          <template slot-scope="scope">
            <el-tag v-show="!!scope.row.Result" :type="scope.row.Result | statusFilter">{{ scope.row.Result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('log.resultMessage')" min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.ResultMessage }}</span>
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
    </el-card>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { debounce } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import md5 from "js-md5";
export default {
  name: "Log",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        成功: "success",
        失敗: "danger",
        失败: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    formatDate: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.slice();
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
        OperatorName: "",
        Operation: "",
        StartDate: "",
        EndDate: "",
        Result:"",
        page: 1,
        limit: 10,
        sort: -1
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
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$axios({
        url: "/api/PBI/GetOperationLog",
        method: "GET",
        params: this.listQuery,
        timeout: 60000
      })
        .then(res => {
          this.list = res.data.ReturnObject.ViewList;
          this.list.forEach(item => {
            item.ParamsArr = item.Params && item.Params.split(",")
          })
          // console.log(res.data, "res");
          this.total = res.data.ReturnObject.Total || 0;
          this.listLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleFilter() 
    {
      // this.throttle1(this.getList, 1000);
      // debounce(this.getList, 1000);
      this.getList();
    },
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
  margin-bottom: 5px;
  &:last-child {
    margin-right: 0px;
    margin-bottom: 0px;
  }
}
</style>
