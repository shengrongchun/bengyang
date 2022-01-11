//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
    //全局登陆方法
    this.login = function(cb=()=>{}) {
      wx.login({
        success (res) {
          if (res.code) {
            console.log('login', res)
            wx.showLoading({
              title: '加载中',
            })
            wx.cloud.callFunction({
              name: 'getApprove',
              data: {code: res.code}
            }).then((data)=> {
              console.log('ddd',data)
              wx.hideLoading()
            }).catch((err)=> {
              console.log('err',err)
              wx.hideLoading()
            })
            //发起网络请求
            // wx.request({
            //   url: 'https://example.com/onLogin',
            //   data: {
            //     code: res.code
            //   }
            // })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }
})
