---
title: trancy-effect
date: 2021-09-01
excerpt: trancy-effect
layout: page
---

<div class="trancy-effect">
# Trancy 风格鼠标悬停效果

这是一个模拟 Trancy 网站鼠标悬停效果的演示页面。

<div id="trancy-effect-demo">
  <div 
    v-for="(item, index) in items" 
    :key="index"
    class="hover-card"
    @mouseover="handleMouseOver($event, item)"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  </div>
</div>

</div>

<script>
export default {
  data() {
    return {
      items: [
        { title: '智能翻译', description: 'AI驱动的高质量翻译服务' },
        { title: '语音合成', description: '自然流畅的语音生成技术' },
        { title: '文本分析', description: '深度解析文本语义结构' },
        { title: '实时同步', description: '多设备无缝数据同步' }
      ],
      mouseX: 0,
      mouseY: 0,
      isActive: false
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.trackMouse);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.trackMouse);
  },
  methods: {
    trackMouse(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    handleMouseOver(e, item) {
      this.isActive = true;
      const el = e.target;
      el.classList.add('active');
    },
    handleMouseLeave(e) {
      this.isActive = false;
      const el = e.target;
      el.classList.remove('active');
    },
    handleMouseMove(e) {
      if (!this.isActive) return;
      
      const el = e.target;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 计算相对于元素中心的偏移
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) * 0.1;
      const moveY = (y - centerY) * 0.1;
      
      // 应用变换效果
      el.style.setProperty('--move-x', `${moveX}px`);
      el.style.setProperty('--move-y', `${moveY}px`);
    }
  }
}
</script>

<style>

#trancy-effect-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.trancy-effect{
   padding: 2rem;
   
}

.hover-card {
  --move-x: 0px;
  --move-y: 0px;
  
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hover-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.4) 0%,
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hover-card:hover {
  transform: translate3d(var(--move-x), var(--move-y), 0) translateY(-5px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover-card.active::before {
  opacity: 1;
}

.hover-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.hover-card p {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}


</style>
