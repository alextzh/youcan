const app = getApp()
const util = require('../../utils/util')
var page = 1
var rows = 10

// 获取团队列表
var getTeamList = function (that, id) {
  wx.request({
    url: app.api_url + '/api/v1/team/listByPersionId',
    data: {
      persion_id: id,
      page: page,
      rows: rows,
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
        teamList: that.data.teamList.concat(list),
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
    teamList: [],
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
      getTeamList(that, pId)
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
    wx.showNavigationBarLoading()
    page = 1
    var that = this
    that.setData({
      fresh: true,
      hasMore: true,
      teamList: []
    })
    var pId = wx.getStorageSync('pId')
    if (pId) {
      getTeamList(that, pId)
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
      getTeamList(that, pId)
    }
  },
  toDetail: function (e) {
    if (!this.data.isFirstAction) {
      return false
    } else {
      this.setData({
        isFirstAction: false
      })
      try {
        wx.setStorageSync('cTeam', e.currentTarget.dataset.item)
      } catch (e) {
      }
      wx.navigateTo({
        url: '../teamMemberList/teamMemberList'
      })
    }
  }
})
