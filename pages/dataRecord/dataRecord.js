const app = getApp()
const util = require('../../utils/util')
var page = 1
var rows = 10

// 获取数据记录
var getDataRecord = function (that, id) {
  wx.request({
    url: app.api_url + '/api/v1/course/listByPersionId',
    data: {
      persion_id: id,
      page: page,
      rows: rows
    },
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    success: function (res) {
      if (!res.data.ret) {
        util.toastMsg('提示', res.data.msg)
        that.setData({
          hasData: true
        })
        return false
      }
      var totalPage = res.data.totalPage
      var list = res.data.rows
      that.setData({
        dataRecord: that.data.dataRecord.concat(list),
        hasData: false
      })
      page++
      if (page > totalPage) {
        that.setData({
          hasMore: false
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
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataRecord: [],
    fresh: false, // 上拉刷新标志
    hasData: false, // 是否有数据
    hasMore: true, // 是否下拉加载
    isFirstAction: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    var pId = wx.getStorageSync('pId')
    if (pId) {
      getDataRecord(that, pId)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    var that = this
    that.setData({
      isFirstAction: true
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1
    wx.showNavigationBarLoading()
    var that = this
    that.setData({
      fresh: true,
      hasMore: true,
      dataRecord: []
    })
    var pId = wx.getStorageSync('pId')
    if (pId) {
      getDataRecord(that, pId)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (!that.data.hasMore) {
      return false
    }
    var pId = wx.getStorageSync('pId')
    if (pId) {
      getDataRecord(that, pId)
    }
  },
  toCollection: function (e) {
    wx.setStorageSync('Item', e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../dataCollection/dataCollection'
    })
  }
})
