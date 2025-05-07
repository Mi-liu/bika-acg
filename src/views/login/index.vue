<script setup lang="ts">
import LoginForm from './LoginForm.vue'

// Title of the website
const title = '二次元の小站'

</script>

<template>
  <div class="login-container w-full h-full flex items-center justify-center bg-light-blue-50">
    <div class="login-content flex w-full max-w-6xl h-4/5 max-h-140 rounded-lg overflow-hidden shadow-xl">

      <div class="image-section hidden md:block md:w-3/5 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Anime portal scene" class="w-full h-full object-cover" />
      </div>
      <div class="form-section w-full md:w-2/5 bg-white p-8 flex flex-col">
        <h1 class="text-2xl font-bold mb-12 mt-4">{{ title }}</h1>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  background-image: linear-gradient(to bottom right, #e0f2fe, #f0f9ff);
}

.login-content {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
