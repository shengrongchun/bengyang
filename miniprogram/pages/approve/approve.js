Page({

  /**
   * 页面的初始数据
   */
  data: {
    locked: false,//是否是没有数据了
    list: [],//审批列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 1 //分页
    this.getList()
  },
  getList() {//获取审批列表
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getApprove',
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
  createApply({currentTarget}) {//去审批
    const { item } = currentTarget.dataset
     wx.navigateTo({
      url: '/pages/apply/apply',
      success(res) {
        res.eventChannel.emit('acceptContent',{item,approve:true})
      }
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