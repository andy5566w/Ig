<template>
  <header class="header">
    <Navigator />
  </header>
  <the-layout>
    <router-view />
  </the-layout>
</template>

<script setup>
import Navigator from './components/Navigator.vue';
import TheLayout from './components/TheLayout.vue';
</script>
