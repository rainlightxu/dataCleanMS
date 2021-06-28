<template>
  <div class="app-container">
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="12">
          <h3>{{ $t("file.uploadList") }}</h3>
        </el-col>
        <el-col class="btns" :span="12">
          <div style="float: right">
            <el-button
              v-waves
              type="success"
              size="small"
              icon="el-icon-refresh"
              @click="getFileList"
              >刷新</el-button
            >
            <el-dropdown
              trigger="hover"
              @command="handleCommand"
              style="margin: 0 10px 0 10px"
            >
              <el-button type="primary" size="small" plain>
                新建
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <!-- <i class="el-icon-folder"></i> -->
                  <svg-icon icon-class="folder" class="icons"></svg-icon>
                  <span>{{ $t("file.folder") }}</span>
                </el-dropdown-item>
                <!-- <el-dropdown-item command="b">Word 文档</el-dropdown-item>
                <el-dropdown-item command="c">Excel 工作簿</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button type="info" size="small" icon="el-icon-rank" @click="handleMove">移动</el-button> -->
            <el-button
              type="primary"
              size="small"
              icon="el-icon-upload"
              @click="dialogUploadVisible = true"
              >{{ $t("file.upload") }}</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleFileRemove"
              >{{ $t("file.remove") }}</el-button
            >
            <!-- <el-button type="primary" size="small" icon="el-icon-download" @click="handleExport">下载</el-button> -->
            <!--  -->
          </div>
        </el-col>
      </el-row>
      <div class="dir-container">
        <div class="directory">
          <span>{{ $t("file.currentContent") }}：</span>
          <span
            v-for="(item, index) in currentPath"
            :key="index"
            @click="pathClicked(item.id, index)"
          >
            <a>{{ item.lastPath }}</a>
            <span style="margin: 0 5px">{{
              index == currentPath.length - 1 ? " " : ">"
            }}</span>
          </span>

          <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            to="#"
            v-for="(item,index) in currentPath"
            :key="index"
            @click="alert('123')"
          >{{item}}</el-breadcrumb-item>
          </el-breadcrumb>-->
        </div>
        <el-input
          :placeholder="$t('file.pleaseKeyIn')"
          v-model="searchInput"
          style="width: 340px"
          class="input-with-select"
          @input="handleFilter"
          :clearable="true"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button> -->
        </el-input>
      </div>
    </el-card>
    <!-- fileList -->
    <el-card>
      <el-table
        :data="files"
        :default-sort="{ prop: 'CreateTime', order: 'descending' }"
        style="width: 100%; cursor: default"
        @row-click="handleRowClicked"
        v-loading="listLoading"
        element-loading-text="Loading"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        tooltip-effect="dark"
      >
        <el-table-column align="center" type="selection"></el-table-column>

        <el-table-column
          sortable
          prop="Name"
          :label="$t('file.name')"
          align="left"
          width="400px"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.Type == ' '"
              :class="iconMap(scope.row.Type)"
              class="icons"
            ></i>
            <svg-icon
              v-else
              :icon-class="iconMap(scope.row.Type, scope.row.Name)"
              class="icons"
            ></svg-icon>
            <el-link
              :href="scope.row.SourceAddress && scope.row.SourceAddress"
              target="_blank"
              >{{ scope.row.Name }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="Type"
          align="center"
          :label="$t('file.type')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.Type == "Folder" ? "文件夹" : "文件" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="Status"
          align="center"
          :label="$t('file.status')"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Status | statusFilter"
              v-show="scope.row.Type === 'File'"
              >{{ scope.row.Status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('file.reason')"
          show-overflow-tooltip
          prop="Reason"
        >
          <template slot-scope="scope">
            <span v-show="scope.row.Status === '失败'">{{
              scope.row.Reason
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('file.canDelete')">
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.CanDelete"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="CreateTime"
          align="center"
          :label="$t('file.createTime')"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.CreateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="CreateUser"
          align="center"
          :label="$t('file.createUser')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.CreateUser }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click.stop="handleEdit(scope.row)">编辑</el-button> -->
            <el-button
              v-show="scope.row.Type === 'File'"
              type="primary"
              size="small"
              @click="reClean(scope.row)"
              >重新清洗</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="大小">
          <template slot-scope="scope">
            <span>{{scope.row.size}}</span>
          </template>
        </el-table-column>-->
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="getFileList"
      />
    </el-card>
    <!-- 新建文件夹对话框 -->
    <el-dialog
      title="创建文件夹"
      :visible.sync="dialogFolderVisible"
      @close="addFolderDiaClosed"
    >
      <el-form
        :model="addFolderForm"
        ref="addFolderRef"
        :rules="addFolderRules"
        label-position="right"
      >
        <el-form-item label="名称" prop="Name" :label-width="formLabelWidth">
          <el-input v-model="addFolderForm.Name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFolderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddFolder">创 建</el-button>
      </div>
    </el-dialog>
    <!-- 移动文件对话框 -->
    <!-- <el-dialog title="移动到" :visible.sync="dialogMoveVisible" width="20%">
      <el-form :model="form" label-position="right">
        <el-form-item label="文件夹" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="个人报表" value="shanghai"></el-option>
            <el-option label="公司账单" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogMoveVisible = false">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 上传文件对话框
        :auto-upload="false"
    -->
    <el-dialog
      title="上传文件"
      :visible.sync="dialogUploadVisible"
      width="35%"
      @close="dialogUploadClosed"
    >
      <el-upload
        class="upload-demo"
        drag
        ref="upload"
        :action="`/api/FileManage/Upload?Id=${this.pathId}&UserCode=${this.UserCode}`"
        multiple
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList"
        accept="image/*, .pdf, .xlsx, .xls, .txt, .ppt, .pptx"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>-->
        <el-button type="primary" plain @click="dialogUploadVisible = false"
          >关闭弹窗</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import waves from "@/directive/waves"; // waves directive
import { getFileList } from "@/api/fileList";
import Pagination from "@/components/Pagination";
import { mapState } from 'vuex'
export default {
  name: "fileManagement",
  components: {
    Pagination,
  },
  directives: { waves },
  data() {
    return {
      root: {},
      files: [],
      pathId: 1,
      list: [],
      currentPath: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      listLoading: false,
      fileList: [],
      fileObj: {},
      dialogFolderVisible: false,
      dialogMoveVisible: false,
      dialogUploadVisible: false,
      addFolderForm: {
        Name: "",
        Id: this.pathId,
        UserCode: this.UserCode,
      },
      formLabelWidth: "60px",
      multipleSelectionArr: [],
      addFolderRules: {
        Name: [
          {
            required: true,trigger:'blur',message:'请输入文件夹名称'
          },
        ],
      },
      advanceFlag: "",
      searchInput: "",
    };
  },
  watch: {},
  computed: {
    ...mapState({
      UserCode: state =>  state.user.UserCode,
      UserGroup: state => state.user.UserGroup
    })
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        未开始: "info",
        处理中: "primary",
        成功: "success",
        失败: "danger",
      };
      return statusMap[status];
    },
  },
  created() {
    this.getFileList();
    let obj = {
      id: 1,
      path: "/SourceData/",
      lastPath: "SourceData",
    };
    this.currentPath.push(obj);
  },
  methods: {
    getFileList() {
      this.listLoading = true;
      this.$axios({
        url: "/api/FileManage/GetFileTree",
        methods: "GET",
        params: { id: this.pathId,UserCode:this.UserCode,userGroup: this.UserGroup && this.UserGroup.join(','),pageNo:this.listQuery.pageNo-1,pageSize:this.listQuery.pageSize},
      }).then((res) => {
        // console.log(res);
        if (res.data.ResultType == "0") {
          this.root = res.data.ReturnObject.FileTree;
          this.files = res.data.ReturnObject.FileTree.Children;
          this.total = res.data.ReturnObject.FileTree.Children.length;
          this.listLoading = false;
        } else {
          this.$notify.error({
            title: "失败",
            message: res.data.Message,
          });
        }
      });
    },
    iconMap(type, name) {
      if (type == "Folder") {
        return "folder";
      } else {
        //如果是文件
        let dotIndex = name.lastIndexOf(".");
        let tail = name.slice(dotIndex + 1);
        switch (tail) {
          case "txt": {
            return "txt";
            break;
          }
          case "xls": {
            return "excel";
            break;
          }
          case "xlsx": {
            return "excel";
            break;
          }
          case "pdf": {
            return "pdf";
            break;
          }
          case "rar": {
            return "rar";
            break;
          }
          case "zip": {
            return "zip";
            break;
          }
          case "ppt": {
            return "powerpoint";
            break;
          }
          case "pptx": {
            return "powerpoint";
            break;
          }
          case "doc": {
            return "word";
            break;
          }
          case "docx": {
            return "word";
            break;
          }
          case "png": {
            return "picture";
            break;
          }
          case "gif": {
            return "picture";
            break;
          }
          case "tif": {
            return "picture";
            break;
          }
          case "jpg": {
            return "picture";
            break;
          }
          default: {
            return "file";
          }
        }
      }
    },
    handleRowClicked(row, column, event) {
      if (row.Type == "Folder") {
        this.advanceFlag = "forward";
        // console.log(row);
        this.pathId = row.ID;
        this.getFileList();

        let obj = {
          id: row.ID,
          path: row.Path,
        };
        this.currentPath.push(obj);
        this.currentPath.forEach((item) => {
          let patharr = item.path.split("/");
          let pathstr = patharr[patharr.length - 2];
          // console.log(patharr, pathstr);
          item.lastPath = pathstr;
        });
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      // console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择三个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleError(res, file, fileList) {
      this.$message.error("上传失败！");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.Name}？`);
    },
    beforeUpload(file) {
      // const isIMAGE =
      //   file.Type == "image/jpeg" ||
      //   file.Type == "image/gif" ||
      //   file.Type == "image/png";
      // const isLt1M = file.Size / 1024 / 1024 < 1;
      // if (!isIMAGE) {
      //   return this.$message.error("上传文件只能是jpeg或gif或png图片格式!");
      // }
      // if (!isLt1M) {
      //   this.$message.error("上传文件大小不能超过 1MB!");
      //   return false;
      // }
      // return true;
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
      this.getFileList();
    },
    dialogUploadClosed() {
      this.fileList = [];
    },
    handleFileRemove() {
      if (this.multipleSelectionArr.length <= 0) {
        return this.$message.error("请选择要删除的文件");
      }
      let IdList = [];
      this.multipleSelectionArr.forEach((item) => {
        IdList.push(item.ID);
      });

      this.$confirm("此操作將永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(`/api/FileManage/Remove`, {
              IdList: IdList,
              UserCode: this.UserCode,
            })
            .then((res) => {
              if (res.data.ResultType == "0") {
                this.getFileList();
                this.$notify.success({
                  title: "成功",
                  message: "删除文件成功！",
                });
                this.getFileList();
              } else {
                this.$notify.error({
                  title: "失败",
                  message: res.data.Message,
                });
                this.getFileList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelectionArr = val;
    },
    handleCommand(command) {
      switch (command) {
        case "a": {
          this.dialogFolderVisible = true;
          break;
        }
        case "b": {
          this.dialogFolderVisible = true;
          break;
        }
        case "c": {
          this.dialogFolderVisible = true;
          break;
        }
      }
    },
    handleExport() {
      this.download(
        "http://115.28.78.175:81/Output/QA_ResultList20200424133235.xls"
      );
    },
    download(href) {
      if (!href) {
        return;
      }
      let url = href;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      let filename = url.slice(url.lastIndexOf("/") + 1);
      link.setAttribute("download", filename);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      // window.open(url);
      document.body.removeChild(link);
      // console.log(link);
    },
    handleMove() {
      if (this.multipleSelectionArr.length <= 0) {
        return this.$message.info("请选择要移动的文件！");
      }
      this.dialogMoveVisible = true;
    },
    confirmAddFolder() {
      this.$axios
        .post(`/api/FileManage/AddFolder`, {
          Name: this.addFolderForm.Name,
          Id: this.pathId,
          UserCode: this.UserCode,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.ResultType === "0") {
            this.$notify.success({
              title: "成功",
              message: "添加文件夹成功！",
            });
            this.getFileList();
            this.dialogFolderVisible = false;
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message,
            });
            this.getFileList();
            this.dialogFolderVisible = false;
          }
        });
    },
    addFolderDiaClosed() {
      this.$refs.addFolderRef.resetFields();
    },
    confirmUpload() {
      // this.$refs.upload.submit();
      this.dialogUploadVisible = false;
    },
    pathClicked(id, index) {
      this.advanceFlag = "backward";
      this.pathId = id;
      this.getFileList();
      this.currentPath = this.currentPath.slice(0, index + 1);
    },
    reClean(row) {
      this.$axios
        .post(`/api/FileManage/ReStart`, {
          Id: row.ID,
          UserCode: this.UserCode,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.ResultType == "0") {
            this.$notify.success({
              title: "成功",
              message: "重新清洗成功！",
            });
            this.getFileList();
          } else {
            this.$notify.error({
              title: "失败",
              message: res.data.Message,
            });
          }
        });
      // .catch(err => {
      //   this.$message.error(err.message);
      // });
    },
    handleEdit(row) {},
    handleFilter() {
      console.log(this.searchInput);
      this.files = this.root.Children.filter((item) => {
        return item.Name.toLowerCase().includes(this.searchInput.toLowerCase());
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dir-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
  .directory {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .el-breadcrumb {
      font-size: 16px;
      font-weight: bold;
      .el-breadcrumb-item {
        &:last-child {
          font-weight: bold;
        }
        &:last-of-type {
          font-weight: bold;
        }
      }
    }
  }
}
.btns {
  height: 50px;
}
.icons {
  font-size: 20px;
}
.app-container {
  h3 {
    margin: 0;
    height: 50px;
  }
}
</style>

<style lang="scss">
.el-tooltip__popper {
  max-width: 500px;
}
</style>