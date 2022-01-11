// pages/view/view.js
const app = getApp()
const globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './cardBg.png',
    list: [ {
      title: "来访申请",
      name: "Apply",
      color: "cyan",
      icon: "apply",
      openType:"navigate",
      url: "/pages/apply/apply",
      tmplId: '2ojePAJOu0rK5v_qgi4A9-ssyoWyYwwUg_RzJy1cBZY'
    }, {
        title: "申请进度",
        color: "blue",
        name: "Application",
        icon: "application",
        openType:"navigate",
        url: "/pages/application/application",
        tmplId: '2ojePAJOu0rK5v_qgi4A9-ssyoWyYwwUg_RzJy1cBZY'
    } , {
        title: "我的审批",
        color: "green",
        name: "Approve",
        icon: "approve",
        url: "/pages/approve/approve",
        tmplId: '7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU'
    }, {
      title: "关于我们",
      color: "purple",
      name: "About",
      icon: "about",
      openType:"navigate",
      url: "/pages/about/about",
      tmplId: '7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU'
    }]
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
  },
  viewClick: function(event) {// view点击
    const {url,tmplId} = event.currentTarget.dataset.item
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success (res) {
      },
      fail(error) {
      },
      complete() {
        if(globalData.ID) {//已经登陆过
          wx.navigateTo({url})
        }else {//请先登陆
          app.login(()=> {//登陆回调成功
            wx.navigateTo({url})
          })
        }
      }
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

  }
})