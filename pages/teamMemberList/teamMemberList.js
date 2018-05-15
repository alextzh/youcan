const app = getApp()
const util = require('../../utils/util')

// 获取学员和教练列表
var getTeamMemberList = function (that, id) {
  wx.showLoading({
    title: '加载中'
  })
  wx.request({
    url: app.api_url + '/api/v1/team/persionsByTeamId',
    data: {
      team_id: id
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
      var customers = res.data.obj.customers
      var persions = res.data.obj.persions
      for (let i = 0; i < customers.length; i++) {
        customers[i].value = i
        customers[i].checked = false
      }
      for (let j = 0; j < persions.length; j++) {
        persions[j].value = j
        persions[j].checked = false
      }
      that.setData({
        customers: customers,
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
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customers: [],
    persions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var cTeam = wx.getStorageSync('cTeam')
    if (cTeam) {
      getTeamMemberList(that, cTeam.id)
    }
  },
  onShow: function () {
    var that = this
    that.onLoad()
  },
  persionsChange: function (e) {
    console.log(e.detail.value)
  },
  customersChange: function (e) {
    console.log(e.detail.value)
  },
  // 长按删除教练
  deletePersionItem: function (e) {
    var that = this
    var team_id = wx.getStorageSync('cTeam').id
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除提示',
      content: '确定要删除该教练吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/api/v1/team/deletePersion',
            data: {
              team_id: team_id,
              type: "persion",
              id: id
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
                getTeamMemberList(that, team_id)
              }, 500)
            },
            fail: function (e) {
              console.log(e)
              util.toastMsg('提示', '网络异常')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 长按删除学员
  deleteCustomerItem: function (e) {
    var that = this
    var team_id = wx.getStorageSync('cTeam').id
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除提示',
      content: '确定要删除该学员吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.api_url + '/api/v1/team/deletePersion',
            data: {
              team_id: team_id,
              type: "customer",
              id: id
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
                getTeamMemberList(that, team_id)
              }, 500)
            },
            fail: function (e) {
              console.log(e)
              util.toastMsg('提示', '网络异常')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 跳转到添加教练页面
  addPersion: function () {
    wx.navigateTo({
      url: '../persionSearch/persionSearch'
    })
  },
  // 跳转到添加学员页面
  addCustomer: function () {
    wx.navigateTo({
      url: '../customSearch/customSearch'
    })
  },
  // 提交表单校验
  checkForm: function (persion, customer) {
    if (persion.length === 0 && customer.length === 0) {
      util.toastMsg('提示', '请选择至少一个教练和学员');
      return false;
    } else if (persion.length === 0) {
      util.toastMsg('提示', '请选择至少一个教练');
      return false;
    } else if (customer.length === 0) {
      util.toastMsg('提示', '请选择至少一个学员');
      return false;
    } else {
      return true;
    }
  },
  // 表单提交
  formSubmit: function (e) {
    var that = this
    var team_id = wx.getStorageSync('cTeam').id
    var input_persion_id = wx.getStorageSync('pId')
    var persion = e.detail.value.persion
    var customer = e.detail.value.customer
    var flag = this.checkForm(persion, customer)
    if (flag) {
      var coach_ids = getCheckedPersion(that, persion)
      var customer_ids = getCheckedCustomer(that, customer)
      wx.request({
        url: app.api_url + '/api/v1/course/consume',
        data: {
          team_id: team_id,
          coach_ids: coach_ids,
          customer_ids: customer_ids,
          class_unit: 1,
          input_persion_id: input_persion_id
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
 * 获取教练ids
*/
var getCheckedPersion = function(that, arr) {
  if (!arr) {
    return ''
  } else {
    var ret = []
    var persions = that.data.persions
    for (let i = 0; i < arr.length; i++) {
      ret.push(persions[arr[i]].id)
    }
    return ret.join()
  }
}
/**
 * 获取学员ids
*/
var getCheckedCustomer = function (that, arr) {
  if (!arr) {
    return ''
  } else {
    var ret = []
    var customers = that.data.customers
    for (let i = 0; i < arr.length; i++) {
      ret.push(customers[arr[i]].id)
    }
    return ret.join()
  }
}