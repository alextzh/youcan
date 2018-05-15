const app = getApp()
const util = require('../../utils/util')

function initTabs(that) {
  return [
    { name: '客户', value: 'customer', checked: 'true' },
    { name: '教练', value: 'coach' }
  ]
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnLoading: false,
    disabled: false,
    img_logo: '../../images/logo.png',
    // tabs:[],
    curType: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setData({
      // tabs: initTabs(that),
      curType: 'coach'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
  },
  // radioChange: function (e) {
  //   var that = this
  //   var val = e.detail.value
  //   if (val === 'customer') {
  //     that.setData({
  //       curType: 'customer'
  //     })
  //   } else {
  //     that.setData({
  //       curType: 'coach'
  //     })
  //   }
  // },
  // 登录提交操作
  formSubmit: function (e) {
    var param = e.detail.value
    var flag = this.checkUserName(param) && this.checkPassword(param)
    if (flag) {
      this.setLoginData1()
      this.mySubmit(param)
    }
  },
  // 设置登录中按钮状态
  setLoginData1: function () {
    this.setData({
      disabled: !this.data.disabled,
      btnLoading: !this.data.btnLoading
    });
  },
  // 设置登录按钮状态
  setLoginData2: function () {
    this.setData({
      disabled: !this.data.disabled,
      btnLoading: !this.data.btnLoading
    });
  },
  // 验证手机号
  checkUserName: function (param) {
    var userName = param.username.trim()
    if (userName.length === 11) {
      return true;
    } else {
      util.toastMsg('提示', '请输入正确的手机号')
      return false;
    }
  },
  // 验证密码
  checkPassword: function (param) {
    var password = param.password.trim()
    if (password.length <= 0) {
      util.toastMsg('提示', '请输入密码')
      return false
    } else if (password.length < 6 || password.length > 20) {
      util.toastMsg('提示', '请输入6-12位密码')
      return false
    } else {
      return true
    }
  },
  // 登录提交数据到后台
  mySubmit: function (param, value) {
    var username = param.username.trim()
    var password = param.password.trim()
    var that = this
    wx.request({
      url: app.api_url + '/api/v1/login/login4Wx',
      data: {
        phone: username,
        pwd: password,
        type: that.data.curType,
        openid: app.openid
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (!res.data.ret) {
          console.log(that.data.lg)
          util.toastMsg('提示', res.data.msg)
          that.setLoginData2()
          return false
        }
        wx.setStorageSync('pId', res.data.obj.persion_id)
        wx.setStorageSync('USERINFO', res.data.obj)
        wx.setStorageSync('mobile', username)
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          that.setLoginData2()
          wx.redirectTo({
            url: '../mine/mine'
          })
        }, 500)
      },
      fail: function (e) {
        console.log(e)
        util.toastMsg('提示', '网络异常')
        that.setLoginData2()
      }
    })
  }
})