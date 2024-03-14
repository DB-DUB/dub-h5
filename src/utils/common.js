export function removeHide() {
  const domClassList = document.getElementsByTagName('body')[0].classList
  if (domClassList.length) {
    document.getElementsByTagName('body')[0].classList.remove('hide')
  } else {
    document.getElementById('app').classList.remove('hide')
  }
}

// Not allow go back in browser history
export function historyNull() {
  history.pushState(null, null, document.URL)
  window.addEventListener('popstate', function() {
    history.pushState(null, null, document.URL)
  })
}

// get single parameter
export function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1])
    }
  }
  return (false)
}
