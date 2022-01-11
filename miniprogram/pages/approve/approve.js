// pages/approve/approve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.approveTip()
  },
  approveTip: function() {
    wx.showModal({
      title: "提示",
      content: "请允许我们像您推送审批通知消息",
      success() {
        wx.requestSubscribeMessage({
          tmplIds: ['7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU'],
          success (res) {
            console.log('tmplIds', res)
          },
          fail(error) {
            console.log('ddd', error)
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})