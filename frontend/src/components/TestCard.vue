<template>
  <div class="test-card">
    <h2>{{ test.name }}</h2>
    <p>{{ test.description }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Test {
  id: number
  name: string
  description: string
}

export default defineComponent({
  name: 'TestCard',
  props: {
    test: {
      type: Object as () => Test,
      required: true
    }
  }
})
</script>

<style scoped>
.test-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.test-card:hover {
  transform: translateY(-2px);
}
</style>