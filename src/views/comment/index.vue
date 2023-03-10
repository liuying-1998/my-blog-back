<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data" border style="width: 100%" fit highlight-current-row>
      <!-- 序号 -->
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * limit + 1
        }}</template>
      </el-table-column>

      <!-- 头像 -->
      <el-table-column label="头像" align="center" width="150">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            size="small"
            :src="scope.row.avatar"
          ></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="昵称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="评论文章" align="center">
        <template slot-scope="scope">{{ scope.row.blog.title }}</template>
      </el-table-column>

      <el-table-column prop="description" label="评论内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column prop="title" label="评论日期" width="230" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteComment(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 30px"
      background
      layout="prev, pager, next,total,->,jumper,sizes"
      :total="count"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getComment, delComment } from "@/api/comment";
import { formateDate } from "@/utils/tools";
export default {
  data() {
    return {
      data: [],
      listLoading: false,
      currentPage: 1, // 当前页码
      limit: 5, // 每页显示条数
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getComment(this.currentPage, this.limit).then(({ data }) => {
        this.listLoading = false;
        this.data = data.rows;
        for (const i of this.data) {
          i.createDate = formateDate(i.createDate);
        }
        this.count = data.total; // 计算总条数
        this.totalPage = Math.ceil(this.count / this.limit); // 总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    // 删除评论
    deleteComment({ id }) {
      this.$confirm("是否删除此条评论信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          delComment(id).then((res) => {
            console.log(res);
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分页
    // 改变每页显示条数
    sizeChangeHandle(pagerNum) {
      this.limit = parseInt(pagerNum);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    // 点击页码
    currentChangeHandle(pageNum) {
      this.currentPage = parseInt(pageNum);
      this.fetchData();
    },
    // 上一页
    prevClickHandle() {
      this.currentPage -= 1;
    },
    // 下一页
    nextClickHandle() {
      this.currentPage += 1;
    },
  },
};
</script>

<style>
</style>