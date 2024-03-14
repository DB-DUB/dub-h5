import '@/styles/reset.less'
import '@/styles/common.less'
import '@/styles/font.less'
import './index.less'

import { onMounted, ref, reactive } from 'vue'

import { CommonBtn } from '@/components/CommonBtn'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { showLoading, hideLoading } from '@/components/Loading'
import { showToast } from '@/components/Toast'

import request from '@/utils/request'
import CustomCreateApp from '@/utils/custom-create-app'

import { removeHide, historyNull, getQueryVariable } from '@/utils/common'

// Not allow go back in browser history
historyNull()

const app = new CustomCreateApp({
  components: {
    'common-btn': CommonBtn,
    'confirm-dialog': ConfirmDialog
  },
  setup() {
    let questionVersion = process.env.QUESTIONS_VERSION

    // Get params
    let paramsUserId = getQueryVariable('userId') || ''
    const oauthToken = getQueryVariable('oauth_token') || ''
    const oauthVerifier = getQueryVariable('oauth_verifier') || ''
    const friendInfo = reactive({
      nickname: '',
      avatar: ''
    })

    const answerStorageKey = 'Answer'

    function handleCredentialResponse(response) {
      const token = response.credential
      console.log('Encoded JWT ID token: ' + token)

      confirmDialogParams.visible = false

      const result = getSubmitData()
      if (result.flag) {
        // Get user google account nickname and avatar
        // getThirdUserInfo({
        //   google_id_token: token,
        //   type: 2
        // }).then(res => {
        //   // Submit data to server
        //   submitAnswersToServer({
        //     answers: result.data.map(item => String(item)),
        //     order: questionVersion,
        //     user_id: paramsUserId,
        //     avatar: res.avatar,
        //     nickname: res.nickname
        //   })
        //   console.log('getThirdUserInfo:', res, {
        //     answers: result.data.map(item => String(item)),
        //     order: questionVersion,
        //     user_id: paramsUserId,
        //     avatar: res.avatar,
        //     nickname: res.nickname
        //   })
        // })

        // Submit data to server
        submitAnswersToServer({
          answers: result.data.map(item => String(item)),
          order: questionVersion,
          user_id: paramsUserId,
          user: {
            google_id_token: token,
            type: 2
          }
        })
      }
    }

    // function getThirdUserInfo(params) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/user/get_third_user`,
    //       method: 'get',
    //       params
    //     }).then(res => {
    //       resolve(res)
    //     }).catch(() => {
    //       reject()
    //     })
    //   })
    // }

    function getFriendInfo() {
      return new Promise((resolve, reject) => {
        if (paramsUserId) {
          request({
            url: `/user/info_noauto`,
            method: 'get',
            params: {
              id: paramsUserId
            }
          }).then(res => {
            friendInfo.avatar = res.user.avatar
            friendInfo.nickname = res.user.nickname
            resolve(res)
          }).catch(() => {
            reject()
          })
        } else {
          reject()
        }
      })
    }

    // Finish page button jump to prank page
    function gotoPrank() {
      window.location.href = `${process.env.DOMAIN2}/login?from=share&userId=${paramsUserId}`
    }

    const confirmDialogParams = reactive({
      visible: false,
      title: '',
      content: 'Please link your account, and we will push the test results to you.'
    })

    const titleInfo = ref({})
    const questions = ref([])
    const submitInfo = ref([])
    const show = ref(false)
    const questionShow = ref(false)

    onMounted(() => {
      const windowW = document.documentElement.clientWidth
      try {
        google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID,
          context: 'signin',
          itp_support: true,
          use_fedcm_for_prompt: true,
          callback: handleCredentialResponse
        })
        google.accounts.id.renderButton(
          document.getElementById('google-login-box'),
          { // customization attributes
            theme: 'filled_black',
            size: 'large',
            text: 'signin',
            // width: Math.round(130 * Math.min(windowW, 750) / 375)
            width: Math.round(271 * Math.min(windowW, 750) / 375)
          }
        )
      } catch (e) {
        console.log('error:', e)
      }
      if (oauthToken && oauthVerifier) { // twitter callback
        twitterCallback()
      } else if (paramsUserId) {
        Promise.all([
          getTitle(),
          getQuestion(),
          getFriendInfo()
        ]).then(() => {
          removeHide()
          questionShow.value = true
        }).catch(() => {})
      }
    })

    const userLang1 = navigator.language
    const userLang2 = navigator.language.split('-')[0]
    const pageDirRtl = ref(false)
    function getTitle() {
      return new Promise((resolve, reject) => {
        request({
          baseURL: '',
          url: `/questions/title.json`,
          method: 'get'
        }).then(res => {
          const langs = Object.keys(res)
          const selectedLang = langs.includes(userLang1) ? userLang1 : langs.includes(userLang2) ? userLang2 : 'en'
          titleInfo.value = res[selectedLang]
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }

    function getQuestion() {
      return new Promise((resolve, reject) => {
        request({
          baseURL: '',
          url: `/questions/${questionVersion}.json`,
          method: 'get'
        }).then(res => {
          const langs = Object.keys(res)
          const selectedLang = langs.includes(userLang1) ? userLang1 : langs.includes(userLang2) ? userLang2 : 'en'
          pageDirRtl.value = selectedLang === 'ar'
          const data = res[selectedLang]
          for (let i = 0; i < data.length; i++) {
            const itemData = data[i]
            if (itemData.type === 'range') {
              const answers = []
              for (let ii = itemData.min; ii <= itemData.max; ii++) {
                answers.push(ii)
              }
              itemData.answers = answers
            }
          }
          questions.value = data
          const list = []
          for (let i = 0; i < data.length; i++) {
            const itemData = data[i]
            if (itemData.type === 'checkbox') {
              list[i] = []
            } else {
              list[i] = ''
            }
          }
          submitInfo.value = list
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }

    const onLoading = () => {
      showLoading()
      setTimeout(() => hideLoading(), 1000)
    }

    const onSubmit = () => {
      const result = getSubmitData()
      if (result.flag) {
        // When all questions are answered, show third login dialog
        confirmDialogParams.visible = true
      } else {
        showToast({
          type: 'error',
          text: 'Please fill in all the answers before submitting the test.'
        })
      }
    }

    function getSubmitData() {
      let submitFlag = true
      // Check if all questions are answered and transform the answers to submit format
      const submitData = []
      for (let i = 0; i < questions.value.length; i++) {
        const itemData = questions.value[i]
        if (submitInfo.value[i].length === 0) {
          submitFlag = false
          break
        } else {
          if (itemData.type === 'checkbox') {
            submitData[i] = submitInfo.value[i].join(',')
          } else {
            submitData[i] = submitInfo.value[i]
          }
        }
      }
      console.log(questionVersion, submitInfo, submitFlag, submitData)
      return {
        flag: submitFlag,
        data: submitData
      }
    }

    function gotoTwitter() {
      // Before jump to twitter login, save answers to localStorage, when twitter callback, submit to server
      const result = getSubmitData()
      if (result.flag) {
        localStorage.setItem(answerStorageKey, JSON.stringify({
          userId: paramsUserId,
          answer: result.data,
          version: questionVersion
        }))
        request({
          url: `/user/twitter_request_token`,
          method: 'get',
          params: {
            oauth_callback: process.env.DOMAIN1 + '/share/?userId=' + paramsUserId
          }
        }).then(res => {
          window.location.href = 'https://api.twitter.com/oauth/authorize?oauth_token=' + res.oauth_token
        })
      }
    }

    function getStorageAnswer() {
      const answerStr = localStorage.getItem(answerStorageKey)
      if (answerStr) {
        try {
          const answer = JSON.parse(answerStr)
          console.log('answer:', answer)
          questionVersion = answer.version
          paramsUserId = answer.userId
          return answer
        } catch (e) {
          console.log('err:', e)
          return null
        }
      } else {
        return null
      }
    }

    function submitAnswersToServer(data) {
      // Submit answers to server
      return new Promise((resolve, reject) => {
        request({
          url: `/prank/topic_answer_user`,
          method: 'post',
          data
        }).then(res => {
          show.value = true
          document.body.parentNode.style.overflow = 'hidden'
          resolve(res)
        }).catch(() => {
          reject()
        })
      })
    }

    function twitterCallback() {
      // Twitter callback handler, get answers from localStorage and submit to server
      const storageAnswer = getStorageAnswer()
      if (paramsUserId) {
        Promise.all([
          getTitle(),
          getQuestion(),
          getFriendInfo()
        ]).then(() => {
          questionShow.value = true
          if (storageAnswer) {
            // Get user twitter account nickname and avatar
            // getThirdUserInfo({
            //   twitter_oauth_token: oauthToken,
            //   twitter_oauth_verifier: oauthVerifier,
            //   type: 1
            // }).then(res => {
            //   submitAnswersToServer({
            //     answers: storageAnswer.answer.map(item => String(item)),
            //     order: storageAnswer.version,
            //     user_id: storageAnswer.userId,
            //     avatar: res.avatar,
            //     nickname: res.nickname
            //   }).then(() => {
            //     localStorage.removeItem(answerStorageKey)
            //   })
            // }).finally(() => {
            //   removeHide()
            // })
            submitAnswersToServer({
              answers: storageAnswer.answer.map(item => String(item)),
              order: storageAnswer.version,
              user_id: storageAnswer.userId,
              user: {
                twitter_oauth_token: oauthToken,
                twitter_oauth_verifier: oauthVerifier,
                type: 1
              }
            }).then(() => {
              localStorage.removeItem(answerStorageKey)
            })
          } else {
            removeHide()
          }
        }).catch(() => {})
      }
    }

    function closeFinish() {
      show.value = false
      document.body.parentNode.style.overflow = 'auto'
    }

    function onInput(e, index) {
      const tmpVal = e.target.value.replace(/[^\d]*/g, '')
      submitInfo.value[index] = tmpVal
    }

    function onBlur(index) {
      const tmpVal = submitInfo.value[index].replace(/[^\d]*/g, '')
      if (String(tmpVal).length === 0) {
        submitInfo.value[index] = ''
      } else {
        submitInfo.value[index] = Math.max(Math.min(tmpVal, questions.value[index].max), questions.value[index].min)
      }
    }

    return {
      onLoading,
      titleInfo,
      questions,
      onSubmit,
      submitInfo,
      confirmDialogParams,
      gotoTwitter,
      gotoPrank,
      show,
      closeFinish,
      questionShow,
      pageDirRtl,
      friendInfo,
      onInput,
      onBlur
    }
  }
})
app.mount('#app')
