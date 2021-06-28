<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-input
          v-model="listQuery.ReportName"
          class="filter-item"
          placeholder="报表名称"
          clearable
          @keydown.enter.native="getList"
        ></el-input>
        <div class="filter-item" style="width:455px;">
          <el-date-picker
            v-model="listQuery.StartUpdateDate"
            placeholder="最近刷新开始日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="getList"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.EndUpdateDate"
            placeholder="最近刷新结束日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="getList"
          ></el-date-picker>
        </div>
        <div class="filter-item" style="width:455px;">
          <el-date-picker
            v-model="listQuery.StartRefreshDate"
            placeholder="报表数据开始日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="getList"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.EndRefreshDate"
            placeholder="报表数据结束日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="getList"
          ></el-date-picker>
          
        </div>
        <el-button type="primary" class="filter-btn" @click="getList">搜索</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column class-name="status-col" align="center"  label="表名" min-width="300">
          <template slot-scope="{row}">
            <span>{{ row.TableName }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="300" align="center" label="报表名称">
          <template slot-scope="scope">
            <span>{{ scope.row.ReportName }}</span>
          </template>
        </el-table-column>


        <el-table-column width="200" align="center" label="最近刷新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.LastUpdate}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="报表数据最新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.MaxDate}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <router-link to="#">
              <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshReport(scope.row)">刷新</el-button>
            </router-link>
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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "PBIRefresh",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        未开始: "info",
        进行中: "primary",
        成功: "success",
        失败: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        ReportName: "",
        StartUpdateDate: "",
        EndUpdateDate: "",
        StartRefreshDate: "",
        EndRefreshDate: "",
      },
      statusMap: [
        { label: "未开始", value: 0 },
        { label: "进行中", value: 1 },
        { label: "成功", value: 2 },
        { label: "失败", value: 3 }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data: res } = await this.$axios({
        url: "/api/PBI/LoadPBIReports",
        method: "GET",
        params: this.listQuery
      });
      if (res.ResultType != 0) {
        return this.$message.error(res.Message);
      }
      this.list = res.ReturnObject.ViewList;
      this.listLoading = false;
    },
    async refreshReport(row) {
      const {ID} = row
      const {data:res} = await this.$axios({
        url:"/api/PBI/RefreshReport",
        method:"POST",
        data:{ID}
      })
      if(res.ResultType != 0) {
        return this.$message.error(res.Message);
      }
      this.$message({
        type:"success",
        message:"刷新成功"
      })
      this.getList()
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
