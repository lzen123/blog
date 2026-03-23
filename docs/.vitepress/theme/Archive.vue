<script setup>
import { data as posts } from "./posts.data.js";
import { ref, onMounted } from "vue";

const groupedPosts = ref({});
const tags = ref([]);

onMounted(() => {
  // 按目录对文章进行分组
  posts.forEach((post) => {
    const pathParts = post.url.split("/");
    const category = pathParts[1] || "未分类";
    console.log(pathParts, "pathParts");
    if (!groupedPosts.value[category]) {
      groupedPosts.value[category] = [];
      tags.value.push(category); // Add category to tags array
    }
    groupedPosts.value[category].push(post);
  });
  console.log(groupedPosts.value, "posts");
});

function scrollToCategory(category) {
  const element = document.querySelector(
    `.category-section[data-category="${category}"]`,
  );
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <div class="archive-page">
    <!-- 新增标签栏 -->
    <div class="tag-bar">
      <button
        v-for="tag in tags"
        :key="tag"
        @click="scrollToCategory(tag)"
        class="tag-button"
      >
        {{ tag }}
      </button>
      <button class="show-more">Show More</button>
    </div>

    <div
      v-for="(categoryPosts, category, index) in groupedPosts"
      :key="index"
      class="category-section"
      :data-category="category"
    >
      <h2 class="category-title">
        {{ category }}
        <span class="post-count">({{ categoryPosts.length }} 篇)</span>
      </h2>
      <ul class="post-list">
        <li v-for="post in categoryPosts" :key="post.url" class="post-item">
          <article class="post-card">
            <h3 class="post-title">
              <!-- 设置相对源文件路径srcDir：posts -->
              <a :href="'.' + post.url">{{ post.title }}</a>
            </h3>
            <div class="post-meta">
              <time :datetime="post.date.iso" class="post-date">{{
                post.date.string
              }}</time>
            </div>
            <p class="post-excerpt" v-if="post.excerpt">
              {{ post.excerpt }}
            </p>
            <a href="#" class="read-more">阅读更多</a>
          </article>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 新增标签栏样式 */
.tag-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  padding: 10px;
  border-radius: 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-button {
  margin: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.show-more {
  margin-left: auto;
  padding: 8px 16px;

  color: #444;
  cursor: pointer;
  font-size: 14px;
}

/* 原有样式保持不变 */
.archive-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px;
}

.total-posts {
  color: #7f8c8d;
  font-size: 18px;
}

.category-section {
  margin-top: 56px;
  scroll-margin-top: calc(64px + 56px);
}

.category-title {
  font-size: 48px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 0 0 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  line-height: 1.2;
}

.post-count {
  font-size: 16px;
  color: #7f8c8d;
  margin-left: 12px;
  font-weight: normal;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  padding: 20px 0;
  padding-top: 0px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  margin-bottom: 8px;
}

.post-card {
  background-color: #fff;
  padding: 19px;
  border-radius: 8px;
  background: linear-gradient(145deg, #f9f9f9, #ffffff);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.02),
    0 1px 3px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.3s ease;
}

.post-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 1.5;
}

.post-title a {
  text-decoration: none;
  color: #2c3e50;
  transition: color 0.25s;
  position: relative;
}

.post-title a::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.post-title a:hover {
  color: #007bff;
}

.post-title a:hover::before {
  width: 100%;
}

.post-meta {
  display: flex;
  align-items: center;
  color: #71717a;
  font-size: 14px;
  margin-bottom: 11px;
}

.post-date {
  color: #7f8c8d;
}

.post-excerpt {
  color: #6b7280;
  line-height: 27px;
  margin: 0;
  font-size: 15px;
}

.read-more {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-top: 8px;
  transition: color 0.3s ease;
}

.read-more:hover {
  text-decoration: underline;
  color: #007bff;
}

/* 响应式设计 - 平板尺寸 */
@media (max-width: 1460px) {
  .archive-page {
    padding: 32px 20px;
  }
  .category-section {
    margin-top: 38px;
  }

  .category-title {
    font-size: 38px;
  }

  .post-title {
    font-size: 24px;
  }
}

/* 响应式设计 - 小平板尺寸 */
@media (max-width: 768px) {
  .archive-page {
    padding: 24px 16px;
  }

  .tag-bar {
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .tag-button,
  .show-more {
    flex-shrink: 0;
    font-size: 13px;
    padding: 6px 12px;
  }

  .category-section {
    margin-top: 28px;
  }

  .category-title {
    font-size: 32px;
    margin-bottom: 18px;
  }

  .post-count {
    font-size: 14px;
  }

  .post-title {
    font-size: 20px;
  }

  .post-card {
    padding: 16px;
  }

  .post-excerpt {
    font-size: 14px;
    line-height: 24px;
  }
}

/* 响应式设计 - 手机尺寸 */
@media (max-width: 480px) {
  .archive-page {
    padding: 20px 12px;
  }

  .tag-bar {
    padding: 8px;
  }

  .tag-button,
  .show-more {
    font-size: 12px;
    padding: 5px 10px;
    margin: 3px;
  }

  .category-section {
    margin-top: 20px;
  }
  .post-item {
    margin-bottom: 0;
  }

  .category-title {
    font-size: 26px;
    /* margin-bottom: 8px; */
  }

  .post-count {
    font-size: 13px;
  }

  .post-title {
    font-size: 18px;
  }

  .post-card {
    padding: 14px;
  }

  .post-excerpt {
    font-size: 13px;
    line-height: 22px;
  }

  .post-meta {
    font-size: 13px;
  }

  .read-more {
    font-size: 13px;
  }
}
</style>
