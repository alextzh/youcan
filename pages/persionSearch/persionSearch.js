const app = getApp()
const util = require('../../utils/util')
var timer = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    persions: [],
    isShow: true,
    fresh: false, // 上拉刷新标志
    hasData: false // 是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getPersionList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    var that = this
    that.setData({
      fresh: true,
      persions: []
    })
    that.getPersionList()
  },
  getPersionList: function () {
    var that = this
    var key = that.data.inputVal
    wx.showLoading({
      title: '加载中'
    })
    var team_id = wx.getStorageSync('cTeam').id
    wx.request({
      url: app.api_url + '/api/v1/persion/list4notInTeam',
      data: {
        team_id: team_id,
        name: key,
        page: 1,
        rows: 100
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success: function (res) {
        if (!res.data.ret) {
          that.setData({
            hasData: true,
            persions: []
          })
          return false
        }
        var persions = res.data.rows
        for (let i = 0; i < persions.length; i++) {
          persions[i].value = i
          persions[i].checked = false
        }
        that.setData({
          persions: persions,
          hasData: false
        })
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
  searchAction: function (e) {
    var that = this
    that.setData({
      inputVal: e.detail.value
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      that.getPersionList()
    }, 1000)
    if (e.detail.value) {
      that.setData({
        isShow: false
      })
    } else {
      that.setData({
        isShow: true
      })
    }
  },
  clearInput: function (e) {
    var that = this
    that.setData({
      inputVal: '',
      isShow: true
    })
    that.getPersionList()
  },
  radioChange: function (e) {
    console.log(e.detail.value)
  },
  checkForm: function (persion) {
    if (!persion) {
      util.toastMsg('提示', '请选择要添加的教练');
      return false
    } else {
      return true
    }
  },
  formSubmit: function (e) {
    var that = this
    var team_id = wx.getStorageSync('cTeam').id
    var persion = e.detail.value.persion
    var flag = that.checkForm(persion)
    if (flag) {
      var persion_id = getCheckedPersion(that, persion)
      wx.request({
        url: app.api_url + '/api/v1/team/addCoach',
        data: {
          team_id: team_id,
          persion_id: persion_id
        },
        header: {
          'content-type': 'application/json',
        },
        method: 'POST',
        success: function (res) {
          if (!res.data.ret) {
            util.toastMsg('提示', res.data.msg)
            return false
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: -1
            })
          }, 500)
        },
        fail: function (e) {
          console.log(e)
          util.toastMsg('提示', '网络异常')
        }
      })
    }
  }
})
/**
 * 获取教练id
*/
var getCheckedPersion = function (that, idx) {
  var persions = that.data.persions
  return persions[idx].persion_id
}