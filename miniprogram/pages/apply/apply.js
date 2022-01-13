// pages/apply/apply.js
import { typesList,rules,formData,getParamsData } from './options'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    train: false,//培训页面
    startDate: null,//开始时间
    formData,
    typesList,
    rules,
  },
  submitForm() {//表单确认
    if(this.loading) {
      return 
    }
    this.selectComponent('#form').validate((valid, errors=[]) => {
      const data = getParamsData(this.data.formData)
      const err = errors.filter(({name})=> {
        return data[name] !==undefined
      })
      if(err.length) {
        this.setData({
          error: err[0].message
        })
        return 
      }
      this.loading = true
      wx.showLoading()
      wx.cloud.callFunction({
        name: 'getApply',
        data: {type: 'add', data},
      }).then((data)=> {
        const { data:list } = data.result
        console.log('提交成功', list)
        if(list.length===1) {//非首次申请
          this.setData({
            train: true,//进入培训页面
          })
        }else {//回到首页
          
        }
        wx.hideLoading()
        this.loading = false
      }).catch((err)=> {
        wx.hideLoading()
        this.loading = false
      })
    })
  },
  formInputChange({currentTarget,detail}) {//name  mobile no
    const name  = currentTarget.dataset.field
    this.setData({
      [`formData.${name}`]: detail.value
    })
  },





  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    //获取当前日期
    const startDate =app.getCurrentDate()
    //获取用户ID
    this.ID = app.globalData.ID
    this.setData({
      startDate,
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