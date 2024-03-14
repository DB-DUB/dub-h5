import { computed } from 'vue'
import './index.less'

export const CommonBtn = {
  template: `<a :class="btnClass" @click="handleClick">
    <slot name="button">{{ btnText }}</slot>
  </a>`,
  props: {
    customClass: {
      type: Array,
      default: () => {
        return []
      }
    },
    btnType: {
      type: String,
      default: 'default' // 'default' | 'primary'
    },
    btnText: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  setup(props, context) {
    const handleClick = () => {
      context.emit('click')
    }
    const btnClass = computed(() => {
      const classArr = ['common-btn', `common-btn-${props.btnType}`]
      return classArr.concat(props.customClass)
    })
    return {
      handleClick,
      btnClass
    }
  }
}
