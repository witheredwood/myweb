<template>
    <div>
      <h1>分页示例（vue + element ui）</h1>
      <!-- 显示内容 -->
      <div class="all-articles-block" v-for="(item, index) in list.slice(pageSize*(currentPage-1), pageSize*currentPage)" :key="index">
        <div class="one-article"><p>{{item}}</p></div>
      </div>
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next"
                     :page-size="pageSize"
                     :hide-on-single-page="value"
                     :total="list.length"
                     :current-page="currentPage"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    data() {
        return {
          value: "false",  // 只有1页时分页不显示
          currentPage: 1,  // 当前显示的页数
          pageSize: 5, // 每页显示几篇文章
          list: [
            "这是第1篇文章", "这是第2篇文章", "这是第3篇文章", "这是第4篇文章", "这是第5篇文章",
            "这是第6篇文章", "这是第7篇文章", "这是第8篇文章", "这是第9篇文章", "这是第10篇文章",
            "这是第11篇文章", "这是第12篇文章", "这是第13篇文章",
          ],  // 要显示的所有文章
        };
    },
    methods: {
        // 分页中页数改变
        handleCurrentChange(currentPage) {
          this.currentPage = currentPage;
          console.log("当前是第 ", this.currentPage, " 页");
        }
    },
}
</script>

<style scoped>

</style>
