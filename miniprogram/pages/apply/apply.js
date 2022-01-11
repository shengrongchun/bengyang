// pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      date: '2021-09-04',
      personType: 1,// 1 非本院职工 2 本院职工
      sex:  1,// 1 男 2 女
      files: []
    }
  },
  radioChange({detail}) {
    this.setData({
      formData: Object.assign(this.data.formData,{personType:+detail.value})
    })
  },
  sexChange({detail}) {
    this.setData({
      formData: Object.assign(this.data.formData,{sex:+detail.value})
    })
  },
  selectFile(files) {
    console.log('files', files)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setData({
          formData: Object.assign(this.data.formData,{
            files: [{url:files.tempFilePaths[0]}],
          })
        })
        resolve('some error')
      }, 1000)
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this)
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