const util = require('utils/util.js')

App({
  api_url: 'https://youcan.5ipsp.com',
  onLaunch: function () {
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: that.api_url + '/api/v1/weixin/getOpenid',
            data: {
              js_code: res.code
            },
            dataType: 'json',
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              if (!res.data.ret) {
                util.toastMsg('提示', res.data.msg)
                return false
              }
              that.openid = res.data.obj.openid
              that.session_key = res.data.obj.session_key
            },
            fail: function (e) {
              console.log(e)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})