<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';

const showSearch = ref(false);

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
</script>

<template>
  <div id="app">
    <Header @toggle-search="toggleSearch" />
    <router-view />
  </div>
</template>

<style>
/* App-specific styles */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
