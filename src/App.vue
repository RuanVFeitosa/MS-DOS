<template>
  <div id="app">
    <BootScreen v-if="!bootComplete" @boot-complete="bootComplete = true" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BootScreen from './components/BootScreen.vue'

const bootComplete = ref(false)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0a0a0a;
  font-family: 'Courier New', monospace;
  min-height: 100vh;
}
</style>