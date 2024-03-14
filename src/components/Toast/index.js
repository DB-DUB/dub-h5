import './index.less'

const toastTpl = `<div class='maskUI-animate-slide-down {toast-style}'>
                    <div>{text}</div>
                  </div>`
export const showToast = (props) => {
  const { type, text } = props
  const obj = document.createElement('div')
  obj.id = 'toastWrap'
  const className = type === 'success' ? 'toast-top success' : 'toast-top danger'
  let context = 'Success'
  if (text) {
    context = text
  }
  obj.innerHTML = toastTpl.replace('{toast-style}', className).replace('{text}', context)
  obj.classList.add('maskWrapShow')
  document.body.appendChild(obj)
  // Auto close after 3s
  setTimeout(() => {
    hideToast()
  }, 3000)
}

const hideToast = () => {
  const toast = document.getElementById('toastWrap')
  if (toast) {
    toast.classList.add('maskWrapHide')
    document.body.removeChild(toast)
  }
}
