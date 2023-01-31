<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data" border style="width: 100%" fit highlight-current-row>
      <!-- 序号 -->
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="项目名称" width="200" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" class="pro-name">{{
            scope.row.name
          }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="项目描述" align="center">
        <template slot-scope="scope">{{
          scope.row.description.toString()
        }}</template>
      </el-table-column>

      <el-table-column label="预览图" align="center" width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 120px"
            :src="scope.row.thumb"
            :preview-src-list="srcList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="github"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="info"
              icon="iconfont icon-github2"
              circle
              size="mini"
              @click="linkToGithub(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editProject(scope.row)"
            ></el-button>
          </el-tooltip>

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
              @click="deleteProject(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form :model="form">
        <!-- 项目名称 -->
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <el-form-item label="项目描述（每一项描述以英文逗号分割）">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <!-- 项目链接 -->
        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <!-- github 地址 -->
        <el-form-item label="Github 地址">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <!-- 预览图 -->
        <el-form-item label="预览图">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <!-- 项目等级 -->
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 确认和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, delProject, setProject } from "@/api/projects";
import Upload from "@/components/upload.vue";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      data: [],
      listLoding: false,
      srcList: [], //图片预览数组
      dialogFormVisible: false, //编辑弹窗
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoding = true;
      getProject().then(({ data }) => {
        this.listLoding = false;
        this.data = data;
        for (let i of this.data) {
          this.srcList.push(i.thumb);
        }
      });
    },
    // 链接去github
    linkToGithub(proInfo) {
      window.open(proInfo.github);
    },
    // 编辑项目
    editProject(proInfo) {
      this.dialogFormVisible = true;
      this.form = { ...proInfo, description: proInfo.description.toString() };
    },
    confirmEditProjectHandle() {
      let obj = { ...this.form };
      obj.description = this.form.description.split(",");
      obj.order = parseInt(this.form.order);

      setProject(obj.id, obj).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("修改成功");
      });
    },
    // 删除一个项目
    deleteProject(proInfo) {
      // console.log(proInfo.id);
      this.$confirm("确定要删除此项目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProject(proInfo.id).then(() => {
            this.$message.success("删除成功");
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
  },
};
</script>

<style scoped>
.pro-name:hover {
  color: rgb(163, 163, 163);
}
</style>