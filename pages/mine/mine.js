const app = getApp()
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    username: '',
    mtype: '',
    persion_level: '',
    isFirstAction: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this
    var mobile = wx.getStorageSync('mobile')
    var userInfo = wx.getStorageSync('USERINFO')

    if (mobile) {
      that.setData({
        mobile: mobile,
        username: userInfo.ch_name,
        mtype: userInfo.type,
        persion_level: userInfo.persion_level
      })
    }
  },
  onShow: function () {
    var that = this
    that.setData({
      isFirstAction: true
    })
  },
  // 跳转到学员消课页面
  toEliminate: function () {
    if (!this.data.isFirstAction) {
      return false
    } else {
      this.setData({
        isFirstAction: false
      })
      wx.navigateTo({
        url: '../eliminateClass/eliminateClass'
      })
    }
  },
  // 跳转到数据记录页面
  toDataRecord: function () {
    if (!this.data.isFirstAction) {
      return false
    } else {
      this.setData({
        isFirstAction: false
      })
      wx.navigateTo({
        url: '../dataRecord/dataRecord'
      })
    }
  },
  // 退出账号操作
  loginOut: function () {
    wx.showModal({
      title: '退出提示',
      content: '您确认要退出该账户吗',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
