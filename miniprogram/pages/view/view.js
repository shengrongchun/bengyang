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
      url: "/pages/apply/apply"
    }, {
        title: "申请进度",
        color: "blue",
        name: "Application",
        icon: "application",
         openType:"navigate",
        url: "/pages/application/application"
    } , {
        title: "我的审批",
        color: "green",
        name: "Approve",
        icon: "approve",
        url: "/pages/approve/approve"
    }, {
      title: "关于我们",
      color: "purple",
      name: "About",
      icon: "about",
      openType:"navigate",
      url: "/pages/about/about"
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
    console.log('ccc', app.globalData)
    // wx.getUserInfo({
    //   success: function(res) {
    //     console.log('res', res)
    //   }
    // })
  },
  viewClick: function(event) {// view点击
    const {name,url} = event.currentTarget.dataset.item
    if(name!=='Approve') {//非审批
      wx.navigateTo({url})
      return
    }
    //我的审批点击
    if(globalData.phone) {//已经登陆过
      wx.requestSubscribeMessage({
        tmplIds: ['7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU'],
        success (res) {
          wx.navigateTo({url})
          console.log('success', res)
        },
        fail(error) {
          console.log('fail', error)
        }
      })
    }else {//请先登陆
      app.login()
    }
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