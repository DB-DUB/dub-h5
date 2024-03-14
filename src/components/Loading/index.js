import './index.less'
import loading from '@/imgs/common/loading.svg'

const loadingTpl = `
                    <div class="loading">
                      <img src="${loading}" />
                    </div>
                  `

export const showLoading = () => {
  if (!document.getElementById('J_loading_wrap')) {
    const obj = document.createElement('div')
    obj.id = 'J_loading_wrap'
    obj.classList = ['fixed-wrap loading-wrap']
    obj.innerHTML = loadingTpl
    document.body.appendChild(obj)
  } else {
    document.getElementById('J_loading_wrap').style.display = 'flex'
  }
}

export const hideLoading = () => {
  const loading = document.getElementById('J_loading_wrap')
  loading.style.display = 'none'
}
