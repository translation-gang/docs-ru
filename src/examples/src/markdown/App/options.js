import { marked } from 'marked'
import { debounce } from 'lodash-es'

export default {
  data: () => ({
    input: '# привет'
  }),
  computed: {
    output() {
      return marked(this.input)
    }
  },
  methods: {
    update: debounce(function (e) {
      this.input = e.target.value
    }, 100)
  }
}
