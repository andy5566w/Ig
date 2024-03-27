<template>
  <div class="postList">
    <slot></slot>
  </div>
</template>
<script setup></script>
<style scoped>
.postList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 400px));
  justify-content: center;
  gap: 48px;
}
</style>
