const app = getApp()
const util = require('../../utils/util')
var timer = 0
var page = 1
var rows = 10

var getCustomerList = function (that, key) {
  var team_id = wx.getStorageSync('cTeam').id
  wx.request({
    url: app.api_url + '/api/v1/customer/list4notInTeam',
    data: {
      team_id: team_id,
      name: key,
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
          customers: []
        })
        return false
      }
      var totalPage = res.data.totalPage
      var customers = res.data.rows
      for (let i = 0; i < customers.length; i++) {
        customers[i].value = i
        customers[i].checked = false
      }
      that.setData({
        customers: that.data.customers.concat(customers),
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
    inputVal: '',
    customers: [],
    isShow: true,
    fresh: false, // 上拉刷新标志
    hasData: false, // 是否有数据
    hasMore: true // 是否下拉加载
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
    getCustomerList(that, that.data.inputVal)
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
      customers: []
    })
    getCustomerList(that, that.data.inputVal)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (!that.data.hasMore) {
      return false
    }
    getCustomerList(that, that.data.inputVal)
  },
  searchAction: function (e) {
    var that = this
    that.setData({
      inputVal: e.detail.value
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      getCustomerList(that, e.detail.value)
    }, 1000)
    if (e.detail.value) {
      that.setData({
        isShow: false
      })
    }
  },
  clearInput: function (e) {
    var that = this
    that.setData({
      inputVal: '',
      isShow: true
    })
    getCustomerList(that, that.data.inputVal)
  },
  radioChange: function (e) {
    console.log(e.detail.value)
  },
  checkForm: function (customer) {
    if (!customer) {
      util.toastMsg('提示', '请选择要添加的学员');
      return false
    } else {
      return true
    }
  },
  formSubmit: function (e) {
    var that = this
    var team_id = wx.getStorageSync('cTeam').id
    var customer = e.detail.value.customer
    var flag = that.checkForm(customer)
    if (flag) {
      var customer_id = getCheckedCustomer(that, customer)
      wx.request({
        url: app.api_url + '/api/v1/team/addCustomer',
        data: {
          team_id: team_id,
          customer_id: customer_id
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
            wx.reLaunch({
              url: '../mine/mine'
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
 * 获取学员id
*/
var getCheckedCustomer = function (that, idx) {
  var customers = that.data.customers
  return customers[idx].id
}