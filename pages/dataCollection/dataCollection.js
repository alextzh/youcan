import { $wuxRater } from '../../components/wux'

const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    currentItem: null,
    heart_energy: {
      absorbed: 3,
      oneself: 3,
      team: 3
    },
    skill_energy: {
      yun: 3,
      chuan: 3,
      tou: 3,
      fang: 3,
      jin: 3
    },
    absorbedFlag: true,
    oneselfFlag: true,
    teamFlag: true
  },
  onLoad: function () {
    var that = this
    var item = wx.getStorageSync('Item')
    that.setData({
      currentItem: item
    })
    var absorbed = 'heart_energy.absorbed'
    var oneself = 'heart_energy.oneself'
    var team = 'heart_energy.team'
    var yun = 'skill_energy.yun'
    var chuan = 'skill_energy.chuan'
    var tou = 'skill_energy.tou'
    var fang = 'skill_energy.fang'
    var jin = 'skill_energy.jin'
    $wuxRater.init('absorbed', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        if (value === 0) {
          that.setData({
            absorbedFlag: false
          })
        } else {
          that.setData({
            [absorbed]: value,
            absorbedFlag: true
          })
        }
      }
    })
    $wuxRater.init('oneself', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        if (value === 0) {
          that.setData({
            oneselfFlag: false
          })
        } else {
          that.setData({
            [oneself]: value,
            oneselfFlag: true
          })
        }
      }
    })
    $wuxRater.init('team', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        if (value === 0) {
          that.setData({
            teamFlag: false
          })
        } else {
          that.setData({
            [team]: value,
            teamFlag: true
          })
        }
      }
    })
    $wuxRater.init('yun', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        that.setData({
          [yun]: value
        })
      }
    })
    $wuxRater.init('chuan', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        that.setData({
          [chuan]: value
        })
      }
    })
    $wuxRater.init('tou', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        that.setData({
          [tou]: value
        })
      }
    })
    $wuxRater.init('fang', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        that.setData({
          [fang]: value
        })
      }
    })
    $wuxRater.init('jin', {
      value: 3,
      text: ['1分', '2分', '3分', '4分', '5分'],
      activeColor: '#005faf',
      fontSize: 28,
      margin: 5,
      defaultTextColor: '#005faf',
      callback(value, data, text) {
        that.setData({
          [jin]: value
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var input_persion_id = wx.getStorageSync('pId')
    var customer_id = wx.getStorageSync('Item').customer_id
    var course_id = wx.getStorageSync('Item').course_id
    var describe = e.detail.value.describe
    var flag = that.data.absorbedFlag && that.data.oneselfFlag && that.data.teamFlag
    if (!flag) {
      util.toastMsg('提示', '请给心能所有项目打分')
      return false
    } else {
      wx.request({
        url: app.api_url + '/api/v1/trainRecord/gather',
        data: {
          input_persion_id: input_persion_id,
          customer_id: customer_id,
          course_id: course_id,
          describe: describe,
          heart_energy: that.data.heart_energy,
          skill_energy: that.data.skill_energy
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
            });
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
