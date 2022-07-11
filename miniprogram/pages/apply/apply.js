// pages/apply/apply.js
import { typesList,rules,formData,getParamsData,getTrainContent } from './options'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    train: false,//培训页面
    startDate: null,//开始时间
    endDate: null,//结束时间
    formData,
    typesList,
    rules,
    approve: false,//只能看，也就是审批状态
    trainList : getTrainContent(),
    trainResult: []
  },
  submitForm() {//表单确认
    this.selectComponent('#form').validate(async(valid, errors=[]) => {
      const data = await getParamsData(this.data.formData)
      const err = errors.filter(({name})=> {
        return data[name] !==undefined
      })
      if(err.length) {
        this.setData({
          error: err[0].message
        })
        return 
      }
      this.addRecord()
    })
  },
  async addRecord() {//提交申请
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const params = await getParamsData(this.data.formData,!this.data.train) //提交的参数
    if(!params) {//图片上传失败
      wx.hideLoading()
      wx.showToast({
        title: '图片上传失败，请重试',
        icon: 'none',
        duration: 2000
      })
      return 
    }
    params.commitDate = app.getCurrentDate()//添加提交时间
    app.confirmSendMsg(app.globalData.applyIds)//订阅申请消息
    const { train } = this.data //是否培训阶段
    wx.cloud.callFunction({
      name: 'getApply',
      data: {type: 'add', train, data: params},
    }).then((data)=> {
      wx.hideLoading()
      if(!data.result) {//首次申请
        this.setData({
          train: true,//进入培训页面
        })
        return 
      }
      //
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      wx.navigateTo({//回到首页
        url: '/pages/view/view'
      })
    }).catch((err)=> {
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 2000
      })
      wx.hideLoading()
    })
  },
  approveCommit({currentTarget}) {//审批通过/驳回
    app.confirmSendMsg(app.globalData.approveIds)//订阅审批消息
    const { type } = currentTarget.dataset
    const { commitApprove } = this
    const msg = type==='yes'?'确定审批通过？':'确定驳回吗？'
    wx.showModal({
      title: '提示',
      content: msg,
      success (res) {
        if (res.confirm) {
          commitApprove(type)
        }
      }
    })
  },
  commitApprove(type) {
    const { _id, status} = this.data.formData
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getApprove',
      data: {type: 'change', data: {_id,status,type}},
    }).then((data)=> {
      const { updated } = data.result?.stats || {}
      if(!updated) {
        wx.showToast({
          title: '已被其他人审批',
          duration: 2000
        })
        return 
      }
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      wx.navigateTo({//回到首页
        url: '/pages/view/view'
      })
      wx.hideLoading()
    }).catch((err)=> {
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        duration: 2000
      })
      wx.hideLoading()
    })
  },
  formInputChange({currentTarget,detail}) {//name  mobile no
    const name  = currentTarget.dataset.field
    let value = detail.value
    if(detail.tempFilePaths) {
      value = [{url: detail.tempFilePaths[0]}]
    }
    this.setData({
      [`formData.${name}`]: value
    })
  },
  delPics({currentTarget}) {//删除图片
    const name  = currentTarget.dataset.field
    this.setData({
      [`formData.${name}`]: []
    })
  },
  failPics({detail}) {//上传大小等的失败
    const {type} = detail
    let msg = '图片大小不能超过5M'
    if(type===2) {
      msg ='选择图片失败'
    }else if(type===3) {
      msg ='图片上传失败'
    }
    this.setData({
      error: msg
    })
  },
  showTrain() {
    wx.showLoading({
      title: '预计5秒中',
      mask: true
    })
    if(app.globalData.pptTempUrl) {
      wx.openDocument({
        filePath: app.globalData.pptTempUrl,
        complete() {
          wx.hideLoading()
        }
      })
    }else {
      wx.downloadFile({
        url: 'https://7368-shengjiaren-5guf1osd10721e44-1305051206.tcb.qcloud.la/rule.pdf?sign=b1e55fe22f370e7ff5680d525b47eebb&t=1657549038',
        success: function (res) {
          const filePath = res.tempFilePath
          app.globalData.pptTempUrl = filePath
          wx.openDocument({
            filePath,
            complete() {
              wx.hideLoading()
            }
          })
        }
      })
    }
  },
  trainRadioChange({currentTarget,detail}) {
    const {answer,index} = currentTarget.dataset
    this.data.trainResult[index] = answer===detail.value
  },
  commitExam() {//考试提交
    const { length } = this.data.trainList
    const resultH = this.data.trainResult.length
    if(resultH===0 || resultH!==length) {
      return this.showMsg('请完成培训题目')
    }
    //
    if(this.data.trainResult.includes(false)) {//答题出错
      this.showMsg('答错，请重新培训')
      clearTimeout(this.timeout)
      this.timeout = setTimeout(()=> {
        this.showTrain()
      },1500)
      return
    }
    this.addRecord()
  },
  showMsg(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },





  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startDate: app.getCurrentDate(),//设置当前日期为进入时间
      endDate: app.getCurrentDate(2),//设置当前日期为进入时间
    })
    //新建传值过来
    const eventChannel = this.getOpenerEventChannel()
    if(eventChannel.on) {
      eventChannel.on('acceptContent',(data)=> {
        const { item={},approve=false } = data
        let temp = {}
        if(item.no) {//有职工号码
          item.personType = '2'
        }
        if(!approve) {//非审批进来
          temp = {
            noPics: [],//工作证照片 [{url:xxx}]
            cardPics: [],//身份证照片 
            jkPics: [],//健康码
            xcPics: [],//行程码
            ymPics: [],//疫苗接种
            genPics: [],//跟台证
          }
        }
        Object.assign(this.data.formData, item, temp)
        this.setData({
          formData: this.data.formData,
          approve
        })
      })
    }
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