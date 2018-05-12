/*showToast*/
function toastMsg(tit, txt) {
  wx.showModal({
    title: tit,
    showCancel: false,
    content: txt
  })
}

module.exports = {
  toastMsg
}
