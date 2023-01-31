<template>
  <div class="app-container"></div>
</template>

<script>
import { getProject } from "@/api/projects";
export default {
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getProject().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style>
</style>