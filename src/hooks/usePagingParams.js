import { ref } from 'vue'

export default function usePagingParams() {
  const current = ref(1)
  const size = ref(20)
  return { current, size }
}
