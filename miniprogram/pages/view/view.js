// pages/view/view.js
import { list } from './options'
const app = getApp()
const globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    User: false,
    avatarUrl: './cardBg.png',
    list: []
  },
  viewClick: function(event) {// view点击
    const { url, tmplId } = event.currentTarget.dataset.item
    app.confirmSendMsg(tmplId,()=> {//订阅消息
      if(globalData.ID) {//已经登陆过
        wx.navigateTo({url})
      }else {//请先登陆
        app.login(()=> {//登陆回调成功
          wx.navigateTo({url})
        })
      }
    })
  },
  goManager() {//进入管理界面
    wx.navigateTo({
      url: '/pages/mange/mange'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.login(()=> {
      let List = list
      if(!globalData.show) {
        List = List.filter(({name})=> {
          return name!=='Apply'
        })
      }
      this.setData({
        list: List,
        User: globalData.User
      })
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