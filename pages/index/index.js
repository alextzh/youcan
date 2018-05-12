//获取应用实例
const app = getApp()

Page({
  data: {
    userAvatar: '',
    userName: '',
    imgUrls: [
      '../../images/banner1.jpg',
      '../../images/banner2.jpg',
      '../../images/banner3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../classTest/classTest'
    })
  },
  onLoad: function () {
    var that = this
    app.getUserInfo((res) => {
      that.setData({
        userAvatar: res.avatarUrl,
        userName: res.nickName
      })
    })
  }
})
