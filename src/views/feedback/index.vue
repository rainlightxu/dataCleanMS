<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-select
          v-model="listQuery.Plant"
          placeholder="Plant"
          class="filter-item"
          clearable
          @change="getList"
        >
          <el-option
            v-for="(item, index) in plants"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="listQuery.StartTime"
          placeholder="开始日期"
          type="month"
          format="yyyy 年 MM 月"
          value-format="yyyyMM"
          @change="handleFilter"
        ></el-date-picker>
        <el-button type="primary" class="filter-btn" @click="handleFilter"
          >搜索</el-button
        >
        <el-button
          type="success"
          class="filter-btn"
          :loading="downloadLoading"
          @click="exportExcel"
          >导出</el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        stripe
      >
        <el-table-column
          key="1"
          fixed="left"
          align="center"
          label="Material Type"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL_TYPE }}</span>
          </template>
        </el-table-column>
        <el-table-column key="2" align="center" label="SU" width="128">
          <template slot-scope="scope">
            <span>{{ scope.row.SU }}</span>
          </template>
        </el-table-column>
        <el-table-column key="3" align="center" label="Category" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.CATEGORY }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="4"
          align="center"
          label="Valuation Type"
          width="125"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.VALUATION_TYPE }}</span>
          </template>
        </el-table-column>
        <el-table-column key="5" align="center" label="物料" width="85">
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="6"
          class-name="status-col"
          label="物料描述"
          min-width="150"
          show-overflow-tooltip
          prop="MATERIAL_DESC"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL_DESC }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="7"
          align="center"
          label="基本计量单位[=MEINS]"
          width="110"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.BASE_UNIT_MEASURE_MEINS }}</span>
          </template>
        </el-table-column>
        <el-table-column key="8" align="center" label="Sum of Zero Base Qty" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.ZERO_BASE_QTY && scope.row.ZERO_BASE_QTY.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="9"
          align="center"
          label="Sum of Act Qty w/o Supp"
          width="124"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_QTY_WO_SUPP && scope.row.ACT_QTY_WO_SUPP.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="10"
          align="center"
          label="Sum of Supplement Qty"
          width="95"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.SUPPLEMENT_QTY && scope.row.SUPPLEMENT_QTY.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column key="11" align="center" label="Sum of Act Qty">
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_QTY && scope.row.ACT_QTY.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="12"
          align="center"
          label="Sum of ZB Value"
          width="95"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ZB_VALUE && scope.row.ZB_VALUE.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="13"
          align="center"
          label="Sum of Act Value"
          width="95"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_VALUE &&scope.row.ACT_VALUE.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column key="14" align="center" label="Sum of Act Scrap Value" width="105">
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_SCRAP_VALUE &&scope.row.ACT_SCRAP_VALUE.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="15"
          align="center"
          label="Wastate Rate"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.WASTAGE_RATE && ((scope.row.WASTAGE_RATE * 100).toFixed(2) + '%') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="16"
          align="center"
          label="Std Scrap Rate"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.STD_SCRAP_RATE && ((scope.row.STD_SCRAP_RATE * 100).toFixed(2) + '%') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="17"
          align="center"
          label="Level1 Reason Code"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.REASON_CODE1 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="18"
          align="center"
          label="Level2 Reason Code"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.REASON_CODE2 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="19"
          align="center"
          label="Level3 Other Feedback"
          min-width="200"
          prop="OTHER_FEEDBACK"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.OTHER_FEEDBACK }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
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
import { parseTime, deepClone, param } from "@/utils";
export default {
  name: "PBIInquiry",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        未開始: "info",
        進行中: "primary",
        已完成: "success",
        失敗: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        Plant: "",
        StartTime: parseTime(new Date(), "{y}{m}"),
        page: 1,
        limit: 10,
        sort: 1,
      },
      plants: [],
    };
  },
  created() {
    this.getList();
    this.getPlants();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data: res } = await this.$axios({
        url: "/api/Feedback/GetFeedbackResult",
        method: "GET",
        params: this.listQuery,
      });
      if (res.ResultType != 0) {
        return this.$notify.error({
          title: "失败",
          message: res.Message,
        });
      }
      // 长列表性能优化  禁止 Vue 劫持数据
      this.list = Object.freeze(res.ReturnObject.ViewList);
      this.total = res.ReturnObject.Total;
      this.listLoading = false;
    },
    async getPlants() {
      const { data: res } = await this.$axios.get("/api/Feedback/LoadPlant");
      // console.log(res)
      if (res.ResultType === "0") {
        this.plants = res.ReturnObject.ViewList;
      } else {
        this.$message.error(res.Message);
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    exportExcel() {
      if (this.total >= 50000) {
        this.$confirm(
          "文件数据量过大(" + this.total + "条), 是否继续导出?",
          "提示",
          {
            confirmButtonText: "继续",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
          }
        )
          .then(() => {
            this.confirmExport();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消导出",
            });
          });
      } else {
        this.confirmExport();
      }
    },
    async confirmExport() {
      this.downloadLoading = true;
      const loading = this.$loading({
        lock: true,
        text: "对应数据文件生成中，请稍侯...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let data = Object.assign({}, this.listQuery, {
        UserCode: this.$store.state.user.UserCode,
      });
      try {
        const { data: res } = await this.$axios({
          url: "/api/Feedback/FeedbackToExcel",
          method: "POST",
          data: data,
        });
        // console.log(res);
        if (res.ResultType != 0) {
          this.$notify.error({
            title: "失败",
            message: res.Message,
          });
          this.downloadLoading = false;
          loading.close();
          return;
        }
        this.download(res.ReturnObject.ResourceUrl);
        this.downloadLoading = false;
        loading.close();
      } catch {
        this.downloadLoading = false;
        loading.close();
        this.$notify.error({
          title: "失败",
          message: "文件生成失败",
        });
      }
    },
    download(href) {
      if (!href) {
        return;
      }
      let url = href;
      // let url = window.URL.createObjectURL(new Blob([href]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      let filename = url.slice(url.lastIndexOf("/") + 1);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      // console.log(link)
      document.body.removeChild(link);
    },
    handleUploadSuccess() {},
    renderheader(h, { column, $index }) {
      return h("span", {}, [
        h("span", {}, column.label.split("/")[0]),
        h("br"),
        h("span", {}, column.label.split("/")[1]),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
