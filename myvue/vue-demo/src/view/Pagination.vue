<template>
    <div>
      <el-tab-pane :label="item.content" v-for="(item, index) in newsCategory" :key="index">
        <div class="articles">
          <div class="new-block" v-for="(article, index) in page.newsList.slice(page.pageSize*(page.currentPage-1), page.pageSize*page.currentPage)" :key="index">
            <div class="new-block-img" style="overflow: hidden">
              <el-image :src="article.image"></el-image>
            </div>
            <div class="one-article" :id="article.id">
              <div class="one-article-title"><h3>{{article.title}}</h3></div>
              <div class="one-article-cont" v-html="article.description"></div>
              <div class="one-article-date"><span> —— {{article.createTime}}</span></div>
              <el-button type="primary" class="one-article-more" round="round" @click="HandleBtnClick">了解更多</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-pagination background layout="prev, pager, next" :page-size="page.pageSize"
                     :hide-on-single-page="page.value"
                     :total="page.newsList.length"
                     :current-page="page.currentPage"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              page: {
                value: 'false',
                currentPage: 1,  // 当前显示的页数
                pageSize: 5, // 每页显示的新闻条数
                newsList: [],
              },
            };
        }
    }
</script>

<style scoped>

</style>
