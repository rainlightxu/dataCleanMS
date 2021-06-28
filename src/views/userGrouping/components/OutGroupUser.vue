<template>
    <div class="OutgroupUser">
        <el-table
            :data="list"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            border
            fit
            highlight-current-row
            style="width: 100%"
            v-loading="listLoading"
            max-height="450"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
                v-loading="loading"
                align="center"
                label="用户名"
                element-loading-text="请给我点时间！"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.UserName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="账号">
                <template slot-scope="scope">
                    <span>{{ scope.row.UserCode}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from "axios";

export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: "success",
                draft: "info",
                deleted: "danger"
            };
            return statusMap[status];
        }
    },
    props: {
        type: {
            type: String
        }
        /* GroupUserCodeList: {
            type: Array,
            default: []
        } */
    },
    data() {
        return {
            DeleteUserDialog: false,
            list: null,
            listQuery: {
                type: this.type,
                GroupUserCodeList: [],
                sort: "1"
            },
            loading: false
        };
    },
    created() {
        this.getList(this.listQuery);
    },
    methods: {
        handleSelectionChange(val) {
            this.list.GroupUserCodeList = [];
            for (let i = 0; i < val.length; i++) {
                this.list.GroupUserCodeList.push(val[i].UserCode);
            }
            // console.log(val, "selectValues.......");
            // console.log(this.list.GroupUserCodeList, "select UserCode");
            this.$emit("takeAddUserList", this.list.GroupUserCodeList);
        },
        getGroupInfo() {},
        //获得不在列表里用户的列表
        getList(listQuery) {
            this.listLoading = true;
            axios
                .get("/api/Authority/GetOutGroupUser", {
                    params: {
                        groupId: listQuery.type
                    }
                })
                .then(res => {
                    this.list = res.data.ReturnObject.ViewList;
                    this.listLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    // console.log(this);
                });
        }
    }
};
</script>

