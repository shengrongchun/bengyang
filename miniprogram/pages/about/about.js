// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ID: '',
    picsList: [{
      url: 'cloud://shengjiaren-5guf1osd10721e44.7368-shengjiaren-5guf1osd10721e44-1305051206/about.jpeg'
    }]
  },
  copyId() {
    wx.setClipboardData({
      data: this.data.ID
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ID: getApp().globalData.ID
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})