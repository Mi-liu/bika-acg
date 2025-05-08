<script setup lang="ts">
import { getCategories } from '@/api/comic'

getCategories().then((res) => {
  console.log(res.categories)
})

console.log(useRequest);

</script>

<template>
  <div class="home-container">
    111
  </div>
</template>

<style scoped>
.home-container {}

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
