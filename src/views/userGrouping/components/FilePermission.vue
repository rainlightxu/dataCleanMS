<template>
  <el-dialog
    title="更改文件权限"
    :visible.sync="filePermissionDialog"
    :close-on-click-modal="false"
    :before-close="dialogClosed"
  >
    <el-tree
      ref="filePermissionTree"
      :data="filePermissionTree"
      show-checkbox
      node-key="ID"
      :check-strictly="true"
      :default-expanded-keys="expanded"
      :default-checked-keys="checked"
      :props="filePermissionProps"
      @check="handleNodeCheck"
      @check-change="handleCheckChange"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClosed">取 消</el-button>
      <el-button type="primary" @click="confirmEdit">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import permission from "@/directive/permission";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  props: {
    type: {
      type: String,
      default: "1",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      filePermissionDialog: false,
      filePermissionList: [],
      filePermissionTree: [],
      expanded: [],
      checked: [],
      filePermissionProps: { children: "children", label: "Name" },
    };
  },
  watch: {
    visible(newVal, oldVal) {
      this.filePermissionDialog = newVal;
      if (newVal) {
        this.getList();
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$axios
        .get("/api/Authority/GetGroupDirectoryPermission", {
          params: { GroupId: this.type },
        })
        .then((response) => {
          // console.log(response);
          this.filePermissionList = [];
          this.filePermissionTree = [];
          this.expanded = []
          this.checked = []
          this.filePermissionList = response.data.ReturnObject.ViewList;
          this.listToTree(this.filePermissionList, this.filePermissionTree, 1);
          this.filePermissionList.forEach((item) => {
            this.expanded.push(item.ID);
            if (item.HasPermission) {
              this.checked.push(item.ID);
            }
          });
          //console.log(this.filePermissionTree);
        });
      this.loading = false;
    },
    listToTree(list, tree, parentId) {
      list.forEach((item) => {
        // 判断是否为父级菜单
        if (item.FatherId === parentId) {
          const child = {
            ...item,
            key: item.ID,
            children: [],
          };
          // 迭代 list， 找到当前菜单相符合的所有子菜单
          this.listToTree(list, child.children, item.ID);
          // 删掉不存在 children 值的属性
          if (child.children.length <= 0) {
            delete child.children;
          }
          // 加入到树中
          tree.push(child);
        }
      });
    },
    handleNodeCheck(node,obj) {
      // console.log(node,obj)
      // 判断是否勾选
      const checked  = obj.checkedKeys.indexOf(node.ID) >= 0
      if(checked) {
        if(node.children) {
          node.children.forEach(item => {
            this.$refs.filePermissionTree.setChecked(item.ID,true,true)
          })
        }
      } else {
        if(node.children) {
          node.children.forEach(item => {
            this.$refs.filePermissionTree.setChecked(item.ID,false,true)
          })
        }
      }
    },
    handleCheckChange(node,checked,childrenChecked) {
      // console.log(node,checked,childrenChecked)
      
      this.checkedNodes = this.$refs.filePermissionTree
        .getCheckedNodes()
        .concat(this.$refs.filePermissionTree.getHalfCheckedNodes());
      // console.log(this.checkedNodes);
    },
    confirmEdit() {
      const checkedList = this.checkedNodes.map((item) => item.ID);
      const allList = this.filePermissionList.map((item) => {
        if (checkedList.indexOf(item.ID) >= 0) {
          item.HasPermission = true;
        } else {
          item.HasPermission = false;
        }
        return {
          ID: item.ID,
          FatherId: item.FatherId,
          HasPermission: item.HasPermission,
        };
      });
      const postData = {
        UserCode: this.$store.state.user.UserCode,
        GroupId: this.type,
        DirectoryPermissionList: allList,
      };
      // console.log(postData)
      this.$axios.post('/api/Authority/UpdateGroupDirectoryPermission',postData).then(res => {
        if(res.data.ResultType === '0') {
          this.$notify.success({
            title:"成功",
            message:'修改成功'
          })
          this.$emit("closeFilePermissionDialog");
        } else {
          this.$notify.error({
            title:'失败',
            message:res.data.Message
          })
        }
      })
    },
    dialogClosed() {
      this.$emit("closeFilePermissionDialog"); // 直接修改父组件的属性
    },
  },
};
</script>

