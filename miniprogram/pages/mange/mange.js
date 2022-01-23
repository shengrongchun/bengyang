// pages/mange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    showDialog: false,
    listTab: [{
        text: "审批管理",
    }, 
    // {
    //     text: "申请管理",
    // }
    ],
    departList: ['医务处','护理部','后保处','教育处','手术室'],
    approveList: [],
    approveLocked: false,
    addObj: {
      name: null,//姓名
      job: null,//职务
      no: null,//工号
      openid: null,//id
      depart: null,//部门
    }
  },
  reflashData(e) {
    const curIndex = e.currentTarget.dataset.index
    if(curIndex===this.data.curIndex) return
    this.setData({
      curIndex,
    })
  },
  openAdd(_,showDialog=true) {
    this.setData({
      showDialog,
      addObj: {
        name: null,//姓名
        job: null,//职务
        no: null,//工号
        openid: null,//id
        depart: null,//部门
      }
    })
  },
  selectDepart({detail}) {
    this.setData({
      [`addObj.depart`]:  this.data.departList[detail.value]
    })
  },
  selectInput({currentTarget,detail}) {
    const name  = currentTarget.dataset.field
    this.setData({
      [`addObj.${name}`]: detail.value.trim()
    })
  },
  dialogConfirm({detail}) {
    const maps = {
      name: '姓名',job:'职务',no:'工号',openid:'id',depart: '部门'
    }
    const { index } = detail
    if(index===0) {//关闭
      this.openAdd(null,false)
    }else if(index===1) {//确定添加
      const keys = Object.keys(this.data.addObj)
      for(const key of keys) {
        if(!this.data.addObj[key]) {
          this.setData({
            error: maps[key]+' 不能为空'
          })
          return
        } 
      }
      //
      this.updateApprove('addApprovePerson', this.data.addObj)
    }
  },
  delApprove({currentTarget}) {
    const {index,item} = currentTarget.dataset
    const updateApprove = this.updateApprove
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success (res) {
        if (res.confirm) {
          updateApprove('delApprovePerson',item,index)
        }
      }
    })
  },
  updateApprove(type,data,index) {//添加，删除操作
    data.uniqueId = data.uniqueId || (+new Date())
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getApprove',
      data: {type, data},
    }).then(()=> {
      if(index===undefined) {//add
        this.data.approveList.unshift(data)
      }else {
        this.data.approveList.splice(index, 1)
      }
      this.setData({
        approveList: this.data.approveList
      })
      wx.showToast({
        title: index===undefined?'添加成功':'删除成功',
        icon: 'success',
        duration: 2000
      })
      this.openAdd(null,false)
    }).finally(()=> {
      wx.hideLoading()
    })
  },
  getApproveList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getApprove',
      data: {type: 'approvePersons', pageIndex: this.pageIndex},
    }).then((data)=> {
      const approveList = data.result.data || []
      if(!approveList.length) {
        this.setData({
          approveLocked: true
        })
      }else {
        this.data.approveList.push(...approveList)
        this.setData({
          approveList: this.data.approveList
        })
      }
    }).finally(()=> {
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 1
    this.getApproveList()
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
    if(this.data.curIndex===0) {//审批人员管理
      this.setData({
        approveList: []
      })
      this.pageIndex = 1
      this.getApproveList()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.curIndex===0) {////审批人员管理
      if(this.data.approveLocked) return
      this.pageIndex +=1
      this.getApproveList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})