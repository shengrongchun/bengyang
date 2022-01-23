const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,//弹框
    dialogObj: {},
    locked: false,
    list: [],//申请列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 1 //分页
    this.getList()
  },
  getList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getApply',
      data: {type: 'get',pageIndex: this.pageIndex},
    }).then((data)=> {
      const list = data.result.data || []
      if(!list.length) {
        this.setData({
          locked: true,
        })
      }else {
        this.data.list.push(...list.reverse())
        this.setData({
          list: this.data.list
        })
      }
      wx.hideLoading()
    }).catch((err)=> {
      wx.hideLoading()
    })
  },
  createApply({currentTarget}) {//新建
    const { item } = currentTarget.dataset
     wx.navigateTo({
      url: '/pages/apply/apply',
      success(res) {
        delete item.openid
        delete item.status
        delete item._id
        res.eventChannel.emit('acceptContent',{item})
      }
    })
  },
  intervalTimer() {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.setData({
        [`dialogObj.timer`]: app.getCurrentDate(0,true)
      })
    },100);
  },
  successApply({currentTarget}) {//查看进入凭证
    this.intervalTimer()
    const { item } = currentTarget.dataset
    const { cardPics=[],noPics=[],jkPics=[],xcPics=[],ymPics=[]} = item
    item.picsList = cardPics.concat(noPics,jkPics,xcPics,ymPics)
    this.setData({
      showDialog: true,
      dialogObj: item
    })
  },
  dialogClose() {//关闭
    clearInterval(this.timer)
    this.setData({
      showDialog: false,
      dialogObj: {}
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
    wx.stopPullDownRefresh()
    this.setData({
      list: []
    })
    this.pageIndex = 1
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.locked) return
    this.pageIndex +=1
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})