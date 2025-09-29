<template>
  <div class="test-container">
    <h1>Test Overview</h1>
    <div class="test-grid">
      <TestCard 
        v-for="test in tests" 
        :key="test.id" 
        :test="test"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TestCard from '../components/TestCard.vue'

interface Test {
  id: number
  name: string
  description: string
}

export default defineComponent({
  name: 'TestView',
  components: {
    TestCard
  },
  setup() {
    const tests = ref<Test[]>([
      { id: 1, name: 'Test 1', description: 'This is the first test' },
      { id: 2, name: 'Test 2', description: 'This is the second test' },
      { id: 3, name: 'Test 3', description: 'This is the third test' }
    ])

    return {
      tests
    }
  }
})
</script>

<style scoped>
.test-container {
  padding: 20px;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>