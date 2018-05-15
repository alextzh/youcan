const app = getApp()
const util = require('../../utils/util')
var rows = 10

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataRecord: [],
    page: 1,
    isNull: true,
    fresh: false, // 上拉刷新标志
    hasData: false, // 是否有数据
    hasMore: true // 是否下拉加载
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getDataRecord()
  },
  onShow: function () {
    var that = this
    that.setData({
      dataRecord: [],
      page: 1,
      isNull: true,
      fresh: false,
      hasData: false,
      hasMore: true
    })
    that.onLoad()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    that.setData({
      fresh: true,
      hasMore: true,
      dataRecord: [],
      page: 1
    })
    that.getDataRecord()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (!that.data.hasMore) {
      return false
    }
    that.setData({
      page: that.data.page + 1,
      isNull: false
    })
    that.getDataRecord()
  },
  // 获取数据记录
  getDataRecord: function () {
    wx.showLoading({
      title: '加载中'
    })
    var that = this
    var pId = wx.getStorageSync('pId')
    var page = that.data.page
    wx.request({
      url: app.api_url + '/api/v1/course/listByPersionId',
      data: {
        persion_id: pId,
        page: page,
        rows: rows
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success: function (res) {
        if (!res.data.ret) {
          that.setData({
            hasData: true,
            hasMore: false
          })
          return false
        }
        var list = res.data.rows
        if (that.data.isNull) {
          that.setData({
            dataRecord: list,
            hasData: false,
            hasMore: true
          })
        } else {
          that.setData({
            dataRecord: that.data.dataRecord.concat(list),
            hasData: false,
            hasMore: true
          })
        }
      },
      fail: function (e) {
        console.log(e)
        util.toastMsg('提示', '网络异常')
      },
      complete: function () {
        wx.hideLoading()
        if (that.data.fresh) {
          setTimeout(() => {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
          }, 1000)
        }
      }
    })
  },
  toCollection: function (e) {
    wx.setStorageSync('Item', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../dataCollection/dataCollection'
    })
  }
})
