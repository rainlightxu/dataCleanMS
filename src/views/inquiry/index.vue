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
          <el-option v-for="(item,index) in plants" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <!-- 
        <el-select
          v-show="listQuery.Channel === '神坊'"
          v-model="listQuery.SubChannel"
          placeholder="Subchannel"
          class="filter-item"
          clearable
          @change="handleFilter"
        >
          <el-option
            v-for="item in subChannels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-show="listQuery.Channel === '神坊' || listQuery.Channel === 'Watsons 屈臣氏'"
          v-model="listQuery.DataType"
          placeholder="Data Type"
          class="filter-item"
          clearable
          @change="handleFilter"
        >
          <el-option
            v-for="item in dataTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="listQuery.Category"
          class="filter-item"
          placeholder="Category"
          clearable
          @change="(value)=>categoryChanged(value)"
        >
          <el-option v-for="(item,index) in categories" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-select
          v-model="listQuery.Brand"
          class="filter-item"
          placeholder="Brand"
          clearable
          @change="brandChanged"
        >
          <el-option v-for="(item,index) in brands" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-select
          v-model="listQuery.IsGift"
          placeholder="Is Gift"
          class="filter-item"
          clearable
          @change="handleFilter"
        >
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
        <el-input
          v-model="listQuery.Platform"
          class="filter-item"
          placeholder="Platform"
          clearable
          @keydown.enter.native="handleFilter"
        ></el-input>
        <el-input
          v-model="listQuery.BarCode"
          class="filter-item"
          placeholder="Barcode"
          clearable
          @keydown.enter.native="handleFilter"
        ></el-input>
        <div style="margin-bottom:10px;display:inline-block;">
          <label>Frequency:</label>
          <el-select
            v-model="listQuery.Frequency"
            placeholder="Frequency"
            @change="frequencyChanged"
          >
            <el-option
              v-for="item in frequencies"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->

        <div class="filter-item" style="width:455px;">
          <el-date-picker
            v-model="listQuery.StartTime"
            placeholder="开始日期"
            type="month"
            format="yyyy 年 MM 月"
            value-format="yyyyMM"
            @change="handleFilter"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.EndTime"
            placeholder="结束日期"
            type="month"
            format="yyyy 年 MM 月"
            value-format="yyyyMM"
            @change="handleFilter"
          ></el-date-picker>
        </div>
        <!-- <div v-else-if="listQuery.Frequency === 'D'" class="filter-item" style="width:455px;">
          <el-date-picker
            v-model="listQuery.StartTime"
            placeholder="开始日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="handleFilter"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.EndTime"
            placeholder="结束日期"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="handleFilter"
          ></el-date-picker>
        </div>
        <div v-else class="filter-item" style="width:455px;">
          <el-date-picker
            v-model="listQuery.StartTime"
            placeholder="开始日期"
            type="week"
            format="yyyy 年 第 WW 周"
            :picker-options="pickerOptions"
            @change="week_start_changed"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.EndTime"
            placeholder="结束日期"
            type="week"
            format="yyyy 年 第 WW 周"
            :picker-options="pickerOptions"
            @change="week_end_changed"
          ></el-date-picker>
        </div>-->
        <el-button type="primary" class="filter-btn" @click="handleFilter">搜索</el-button>
        <el-button
          type="primary"
          class="filter-btn"
          @click="exportExcel"
          :loading="downloadLoading"
        >导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        stripe
      >
        <el-table-column key="1" fixed="left" align="center" label="工厂" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.PLANT }}</span>
          </template>
        </el-table-column>
        <el-table-column key="2" align="center" label="O + M" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.OM }}</span>
          </template>
        </el-table-column>
        <el-table-column key="3" align="center" label="订单" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.ORDER_NUM }}</span>
          </template>
        </el-table-column>
        <el-table-column key="4" align="center" label="SU" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.SU }}</span>
          </template>
        </el-table-column>
        <el-table-column key="5" align="center" label="Category" width="85">
          <template slot-scope="scope">
            <span>{{ scope.row.CATEGORY }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="6"
          class-name="status-col"
          align="center"
          label="Category 2"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.CATEGORY2 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="7"
          align="center"
          label="Material code of / header material"
          width="130"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL_CODE_HEARER_MATERIAL }}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="8"
          align="center"
          label="Description of this header material"
          width="255"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.DESC_HEADER_MATERIAL}}</span>
          </template>
        </el-table-column>
        <el-table-column key="9" align="center" label="物料" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL}}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="10"
          align="center"
          label="物料描述"
          width="250"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL_DESC}}</span>
          </template>
        </el-table-column>

        <el-table-column key="11" align="center" label="Valuation Type" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.VALUATION_TYPE}}</span>
          </template>
        </el-table-column>

        <el-table-column key="12" align="center" label="Material Type" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.MATERIAL_TYPE}}</span>
          </template>
        </el-table-column>

        <el-table-column key="13" align="center" label="可选的BOM" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.ALTERNATIVE_BOM}}</span>
          </template>
        </el-table-column>

        <el-table-column key="14" align="center" label="物料单" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.BILL_MATERIAL}}</span>
          </template>
        </el-table-column>

        <el-table-column key="15" align="center" label="订单类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ORDER_TYPE}}</span>
          </template>
        </el-table-column>
        <el-table-column key="16" align="center" label="项目类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.ITEM_CATEGORY }}</span>
          </template>
        </el-table-column>

        <el-table-column key="17" align="center" label="移动类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.MOVEMENT_TYPE }}</span>
          </template>
        </el-table-column>

        <el-table-column key="18" align="center" label="库存地点" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.STORAGE_LOCATION}}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="19"
          align="center"
          label="收到货物的数量/（AMEIN）"
          width="120"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.QTY_GOODS_RECVD}}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="20"
          align="center"
          label="订单项数量/（AMEIN）"
          width="100"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ORDER_ITEM_QUANTITY}}</span>
          </template>
        </el-table-column>

        <el-table-column
          key="21"
          align="center"
          label="需求数量/（EINHEIT）"
          width="110"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.REQUIREMENT_QUANTITY}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="22"
          align="center"
          label="撤回数量/（EINHEIT）"
          width="110"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.QUANTITY_WITHDRAWN}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="23"
          align="center"
          label="领料价值/（WAERS）"
          width="110"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.VALUE_WITHDRAWN}}</span>
          </template>
        </el-table-column>
        <el-table-column key="24" align="center" label="部件废品（%）" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.COMPONENT_SCRAP}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="25"
          align="center"
          label="基本计量单位/（=EINHEIT）"
          width="120"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.BASE_UNIT_MEASURE_EINHEIT}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="26"
          align="center"
          label="基本计量单位/（=MEINS）"
          width="110"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.BASE_UNIT_MEASURE_MEINS}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="27"
          align="center"
          label="Zero Base Qty"
          width="90"
          show-overflow-tooltip
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ZERO_BASE_QTY}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="28"
          align="center"
          label="Act Qty w/o Supp"
          width="85"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_QTY_WO_SUPP}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="29"
          align="center"
          label="Supplement Qty"
          width="150"
          :render-header="renderheader"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.SUPPLEMENT_QTY}}</span>
          </template>
        </el-table-column>
        <el-table-column key="30" align="center" label="Act Qty" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_QTY}}</span>
          </template>
        </el-table-column>
        <el-table-column key="31" align="center" label="Std Price" width="85" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.STD_PRICE}}</span>
          </template>
        </el-table-column>
        <el-table-column key="32" align="center" label="ZB Value" width="85" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ZB_VALUE}}</span>
          </template>
        </el-table-column>
        <el-table-column key="33" align="center" label="Act Value" width="85" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_VALUE}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="34"
          align="center"
          label="Act Scrap Value"
          width="88"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ACT_SCRAP_VALUE}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="35"
          align="center"
          label="Act Scrap Rate"
          width="88"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.ACT_SCRAP_RATE * 100).toFixed(2) + "%"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          key="36"
          align="center"
          label="STD Scrap rate"
          width="95"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.STD_SCRAP_RATE * 100).toFixed(2) + "%"}}</span>
          </template>
        </el-table-column>
        <el-table-column key="37" align="center" label="需求日期" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.REQUEST_DATE}}</span>
          </template>
        </el-table-column>
        <el-table-column key="38" align="center" label="Month" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.W_MONTH}}</span>
          </template>
        </el-table-column>
        <el-table-column key="39" align="center" label="Feedback from Plant" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.FEEDBACK_NOTES}}</span>
          </template>
        </el-table-column>
        <el-table-column key="40" align="center" label="Adj Amount" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.ADJ_AMOUNT}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column key="22" fixed="right" align="center" label="動作" width="150">
          <template slot-scope>
            <router-link to="#">
              <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
            </router-link>
          </template>
        </el-table-column>-->
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
        Plant:"",
        StartTime: parseTime(new Date(), "{y}{m}"),
        EndTime: "",
        page: 1,
        limit: 10,
        sort: 1,
      },
      plants:[],
      channels: [],
      subChannels: [
        { label: "Momo", value: "Momo" },
        { label: "Yahoo購物中心", value: "Yahoo購物中心" },
        { label: "Yahoo超級商城", value: "Yahoo超級商城" },
        { label: "蝦皮", value: "蝦皮" },
        { label: "博客來", value: "博客來" },
        { label: "東森購物", value: "東森購物" },
        { label: "福利網", value: "福利網" },
        { label: "Others", value: "Others" },
      ],
      dataTypes_SF: [
        { label: "Normal", value: "Normal" },
        { label: "None-SubChannel", value: "None-SubChannel" },
      ],
      dataTypes_WS: [
        { label: "Normal", value: "Normal" },
        { label: "None-Store", value: "None-Store" },
      ],
      categories: [],
      brands: [],
      frequencies: [
        { label: "月", value: "M" },
        { label: "日", value: "D" },
        { label: "周", value: "W" },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        firstDayOfWeek: 1,
      },
    };
  },
  created() {
    this.getList();
    this.getPlants();
    // this.getChannels();
    // this.getCategories();
  },
  watch: {
    // "listQuery.Channel": {
    //   handler(newName, oldName) {
    //     // ...
    //     // console.log(newName, oldName);
    //     if (newName !== "神坊") {
    //       this.listQuery.SubChannel = "";
    //       this.listQuery.DataType = "";
    //     } else if (newName !== "Watsons 屈臣氏") {
    //       this.listQuery.DataType = "";
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // "listQuery.Category": {
    //   handler(newName, oldName) {
    //     // ...
    //     // console.log(newName, oldName);
    //     if (newName === "") {
    //        this.brands = []
    //        console.log(this.brands)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  computed: {
    // brands: {
    //   get() {
    //   },
    //   set() {
    //     if (this.listQuery.Category === "") {
    //       return [];
    //     } else {
    //     }
    //   }
    // },
    dataTypes() {
      if (this.listQuery.Channel === "神坊") {
        return this.dataTypes_SF;
      } else if (this.listQuery.Channel === "Watsons 屈臣氏") {
        return this.dataTypes_WS;
      } else {
        return [];
      }
    },
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data: res } = await this.$axios({
        url: "/api/PBI/GetWastageResult",
        method: "GET",
        params: this.listQuery,
      });
      // console.log(res);
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
      const { data: res } = await this.$axios.get("/api/PBI/LoadPlant");
      // console.log(res)
      if (res.ResultType === "0") {
        this.plants = res.ReturnObject.ViewList;
      } else {
        this.$message.error(res.Message);
      }
    },
    async getChannels() {
      const { data: res } = await this.$axios.get("/api/PBI/LoadChannel");
      // console.log(res)
      if (res.ResultType === "0") {
        this.channels = res.ReturnObject.ViewList;
      } else {
        this.$message.error(res.Message);
      }
    },
    async getCategories() {
      const params = deepClone(this.listQuery);
      delete params.page;
      delete params.limit;
      delete params.sort;
      delete params.Category;
      delete params.Brand;
      const { data: res } = await this.$axios.get("/api/PBI/LoadCategry", {
        params,
      });
      // console.log(res);
      if (res.ResultType === "0") {
        this.categories = res.ReturnObject.ViewList;
        if (this.listQuery.Category) {
          const category = this.categories.find(
            (item) => item === this.listQuery.Category
          );
          if (!category) {
            this.listQuery.Category = "";
            this.listQuery.Brand = "";
            this.getList();
            this.brands = [];
          }
        }
      } else {
        this.categories = [];
        this.$message.error(res.Message);
      }
    },
    async getBrands() {
      const params = deepClone(this.listQuery);
      delete params.page;
      delete params.limit;
      delete params.sort;
      delete params.Brand;
      const { data: res } = await this.$axios.get("/api/PBI/LoadBrand", {
        params,
      });
      if (res.ResultType === "0") {
        this.brands = res.ReturnObject.ViewList;
        if (this.listQuery.Brand) {
          const brand = this.brands.find(
            (item) => item === this.listQuery.Brand
          );
          if (!brand) {
            this.listQuery.Brand = "";
            this.getList();
          }
        }
      } else {
        this.brands = [];
        this.$message.error(res.Message);
      }
    },
    handleFilter() {
      // this.listQuery.Category = this.listQuery.Brand = "";
      this.listQuery.page = 1;
      this.getList();
      // this.getCategories();
    },
    frequencyChanged() {
      if (this.listQuery.Frequency === "D") {
        this.listQuery.StartTime = parseTime(new Date(), "{y}-{m}-{d}");
        this.handleFilter();
      } else if (this.listQuery.Frequency === "M") {
        this.listQuery.StartTime = parseTime(new Date(), "{y}-{m}");
        this.handleFilter();
      } else {
        this.listQuery.StartTime = parseTime(new Date(), "{y}-{m}-{d}");
        this.handleFilter();
      }
    },
    week_start_changed() {
      this.listQuery.page = 1;
      if (this.listQuery.StartTime) {
        // console.log(this.listQuery.StartTime.toUTCString());
        let utcStr = this.listQuery.StartTime.toUTCString();
        let utcDate = new Date(utcStr);
        let utcYear = utcDate.getUTCFullYear();
        let utcMonth = utcDate.getUTCMonth() + 1;
        let utcDay = utcDate.getUTCDate();
        let startDate = utcYear + "-" + utcMonth + "-" + utcDay;
        // console.log(startDate);
        this.listQuery.StartTime = startDate;

        this.getList();
      } else {
        this.getList();
      }
    },
    week_end_changed() {
      this.listQuery.page = 1;
      if (this.listQuery.EndTime) {
        let utcStr_end = this.listQuery.EndTime.toUTCString();
        let utcDate_end = new Date(utcStr_end);
        let utcYear_end = utcDate_end.getUTCFullYear();
        let utcMonth_end = utcDate_end.getUTCMonth() + 1;
        let utcDay_end = utcDate_end.getUTCDate();
        let endDate = utcYear_end + "-" + utcMonth_end + "-" + utcDay_end;
        // console.log(endDate);
        this.listQuery.EndTime = endDate;

        this.getList();
      } else {
        this.getList();
      }
    },
    channelChanged() {
      // debugger;
      this.handleFilter();
    },
    categoryChanged(value) {
      // console.log(value)
      if (value === "") {
        this.listQuery.Brand = "";
        this.brands = [];
      } else {
        this.getList();
        this.getBrands();
      }
    },
    brandChanged() {
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
      const { data: res } = await this.$axios({
        url: "/api/PBI/ExportExcel",
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
