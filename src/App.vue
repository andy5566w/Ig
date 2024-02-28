<template>
  <template v-if="$route.name !== 'login'">
    <header class="header">
      <Navigator />
    </header>
    <the-layout>
      <router-view />
    </the-layout>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script setup>
import Navigator from './components/Navigator.vue';
import TheLayout from './components/TheLayout.vue';
</script>
