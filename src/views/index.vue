<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <h1>欢迎来到首页</h1>
    <p>这是一个示例首页，您可以在这里看到登录后的内容。</p>
    <button @click="goToLogin" class="login-button">去登录</button>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.login-button {
  padding: 12px 24px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s;
}

.login-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
