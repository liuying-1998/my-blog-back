<template>
  <div>
    <!-- 文章标题 -->
    <div class="blog-title">文章标题</div>
    <div style="margin-botom: 15px">
      <el-input placeholder="请输入文章标题" v-model="form.title"></el-input>
    </div>

    <!-- 文章编辑 -->
    <div class="blog-title">文章编辑</div>
    <Editor
      :initialValue="form.editorText"
      ref="toastTuiEditor"
      height="600px"
      :options="editorOptions"
    />

    <!-- 文章描述 -->
    <div class="blog-title">文章描述</div>
    <el-input type="textarea" rows="6" v-model="form.description"></el-input>

    <!-- 文章头图 -->
    <Upload uploadTitle="文章头图(可选填)" v-model="form.thumb" />

    <!-- 文章分类 -->
    <div class="blog-title">文章分类</div>
    <el-select
      v-model="form.select"
      slot="prepend"
      placeholder="请选择文章分类"
      @change="changeType"
    >
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 发布按钮 -->
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnConten }}</el-button
      >
      <el-button
        v-if="mode === 'edit'"
        type="info"
        style="margin-top: 15px"
        @click="cancelHandle"
        >取消</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/upload.vue";
import { getBlogType } from "@/api/blogType";
import { addBlog, findOneBlog, editBlog } from "@/api/blog";
import "@toast-ui/editor/dist/i18n/zh-cn";

export default {
  props: ["mode"],
  components: {
    Editor,
    Upload,
  },
  data() {
    return {
      form: {
        editorText: "",
        description: "", //文章描述
        thumb: "", //文章标题图片
        select: "", //文章分类
      },
      blogType: [],
      editorOptions: {
        language: "zh-CN",
      },
      btnConten: "发布文章",
    };
  },
  created() {
    getBlogType().then((res) => {
      this.blogType = res.data;
    });
    console.log(this.mode);
    if (this.mode === "edit") {
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastTuiEditor.invoke("setHTML", data.htmlContent);
      });
    }
  },
  methods: {
    changeType() {
      this.$forceUpdate();
    },
    // 发布文章
    addArticleHandle() {
      // 获取表单内容
      let html = this.$refs.toastTuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastTuiEditor.invoke("getMarkdown");

      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdown,
      };
      console.log(obj);
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        // 发送请求
        if (this.mode === "add") {
          addBlog(obj).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
          });
        } else {
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
          });
        }
      } else {
        this.$message.error("请填写所有内容");
      }
    },
    // 取消编辑
    cancelHandle() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-title {
  margin: 15px 0;
  font-weight: 100;
}
</style>