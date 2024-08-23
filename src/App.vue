<script setup lang="ts">

</script>

<template>
  <div class="main">
    <div class="flex flex-1" style="overflow: hidden;">
        <div class="flex-1" style="background-color: #fff; overflow: hidden;" >
          <router-view></router-view>
        </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
