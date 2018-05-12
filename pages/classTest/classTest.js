//获取应用实例
const app = getApp()

Page({
  data: {
    userAvatar: '',
    userName: '',
    rate1: 1,
    rate2: 1,
    rate3: 1
  },
  onLoad: function () {
    var that = this
    app.getUserInfo((res) => {
      that.setData({
        userAvatar: res.avatarUrl,
        userName: res.nickName
      })
    })
  },
  handleChange1: function (e) {
    this.setData({
      rate1: e.detail.value
    })
  },
  handleChange2: function (e) {
    this.setData({
      rate2: e.detail.value
    })
  },
  handleChange3: function (e) {
    this.setData({
      rate3: e.detail.value
    })
  }
})
