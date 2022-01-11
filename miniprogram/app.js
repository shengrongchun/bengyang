//app.js
App({
  onLaunch: function () {
    this.globalData = {}
    //
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'shengjiaren-5guf1osd10721e44',
        traceUser: true,
      })
      //全局登陆方法
      this.login = function(cb=()=>{}) {
        wx.cloud.callFunction({
          name: 'getApprove',
        }).then((data)=> {
          const { openid } = data.result || {}
          if(openid) {
            console.log('登陆成功', openid)
            this.globalData.ID = openid
            cb()
          }
          wx.hideLoading()
        }).catch((err)=> {
           wx.showToast({
            title: '登陆失败',
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
        })
      }
      //
      this.login()
    }
  }
})
