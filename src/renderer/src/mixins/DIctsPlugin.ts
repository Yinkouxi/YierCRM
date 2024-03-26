import { ref, App } from 'vue'
import { queryBatch, Dicts } from '@api/dicts'
export const dicts = ref<Partial<Dicts>>({})

export default function useDicts(app: App) {
  async function getDicts(data: string[]) {
    let res = await queryBatch(data)
    dicts.value = res.data
  }

  app.mixin({
    data() {
      return {
        dicts
      }
    },
    methods: {
      getDicts
    }
  })
}
