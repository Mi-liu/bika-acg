import { reactive } from 'vue'

export const CommonConfig = reactive({
  components: {
    pagination: {
      defaultPageSize: 20,
      defaultCurrentPage: 1,
    },
  },
})
