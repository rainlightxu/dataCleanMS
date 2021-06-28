<template>
    <div style="width: 30%;display:inline-block;float:right;margin-right:30px;position:relative;">
        <h4>{{$t('userGroup.groupAuths')}}</h4>
        <el-tree
            :data="list"
            :loading="loading"
            show-checkbox
            node-key="ItemId"
            :default-expanded-keys="expanded"
            :default-checked-keys="selectedItem"
            :props="GroupProps"
        ></el-tree>
        <!-- <div class="modalBox"></div> -->
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        groupId: {
            type: String,
            default: "1"
        }
    },
    data() {
        return {
            selectedItem: [],
            GroupProps: { children: "Child", label: "ItemName",disabled: 'ItemId' },
            list: null,
            expanded: [],
            loading: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            // console.log(this.groupId, "groupId");
            this.loading = true;
            axios
                .get("/api/Authority/GetGroupAuthority", {
                    params: { GroupId: this.groupId }
                })
                .then(res => {
                    this.list = res.data.ReturnObject.ViewList;
                    this.list.forEach(item => {
                        // this.$set(item, "disabled", true);
                        if (item.Child.length > 1) {
                            this.expanded.push(item.ItemId);
                        }
                        /*    if (item.IsValid == true) {
                            this.selectedItem.push(item.ItemId);
                        } */
                        item.Child.forEach(item => {
                            // this.$set(item, "disabled", true);
                            if (item.IsValid == true) {
                                this.selectedItem.push(item.ItemId);
                            }
                        });
                    });
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>
<style lang="scss">
@media only screen and(max-width: 950px) {
    .GroupTable {
        width: 100% !important;
        margin-right: 0px !important;
    }
}
.modalBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 9999;
}
.el-tree {
    /deep/  {
      .el-checkbox {
        .el-checkbox__input .el-checkbox__inner {
          background-color: #fff;
        }
      }
      .el-checkbox.is-checked {
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #1890ff;
          border-color: #1890ff;
          &::after {
            border-color: #fff;
          }
        }
      }
    }
}
</style>

