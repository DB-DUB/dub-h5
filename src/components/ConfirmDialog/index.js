import { computed, ref, watch } from 'vue'
import './index.less'

import { CommonBtn } from '@/components/CommonBtn'

export const ConfirmDialog = {
  template: `<div :class="dialogClass" v-show="dialogShow">
    <div class="block-layer" @click="handleBgClick"></div>
    <div class="confirm-box">
      <div v-show="title" class="confirm-dialog-header">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="confirm-dialog-body">
        <slot name="content">
          {{ content }}
        </slot>
      </div>
      <div class="confirm-dialog-footer">
        <slot name="cancel-button">
          <common-btn
            v-if="cancelText"
            :custom-class="['confirm-dialog-footer-btn']"
            btn-type="default"
            :btn-text="cancelText"
            @click="handleBtnClick('cancel')">
          </common-btn>
        </slot>
        <slot name="confirm-button">
          <common-btn
            v-if="confirmText"
            :custom-class="['confirm-dialog-footer-btn', {'only-confirm-btn': !cancelText}]"
            btn-type="primary"
            :btn-text="confirmText"
            @click="handleBtnClick('confirm')">
          </common-btn>
        </slot>
      </div>
    </div>
  </div>`,
  components: {
    'common-btn': CommonBtn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    bgCancel: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel', 'update:visible'],
  setup(props, context) {
    const dialogBaseClass = ref(['confirm-dialog'])
    const dialogShow = ref(props.visible)
    const dialogClass = computed(() => {
      return dialogBaseClass.value.concat(props.customClass)
    })
    const handleBtnClick = (type) => {
      if (type === 'confirm') {
        context.emit('confirm')
      } else {
        // context.emit('update:visible', false)
        context.emit('cancel')
      }
    }
    const handleBgClick = () => {
      if (props.bgCancel) {
        context.emit('cancel')
      }
    }
    watch(() => props.visible, (newVal, oldVal) => {
      console.log('watch visible:', newVal, oldVal)
      if (newVal !== oldVal) {
        if (newVal) { // open
          dialogShow.value = true
          window.requestAnimationFrame(() => {
            dialogBaseClass.value.push('show')
          })
        } else { // close
          dialogBaseClass.value = ['confirm-dialog']
          setTimeout(() => {
            dialogShow.value = false
          }, 300)
        }
      }
    })
    return {
      dialogClass,
      dialogShow,
      handleBtnClick,
      handleBgClick
    }
  }
}
