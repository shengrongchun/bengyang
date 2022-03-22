//app.js
App({
  onLaunch: function () {
    this.globalData = {
      applyIds: '2ojePAJOu0rK5v_qgi4A9-ssyoWyYwwUg_RzJy1cBZY',
      approveIds: '7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU'
    }
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
        wx.showLoading()
        wx.cloud.callFunction({
          name: 'getApprove',
        }).then((data)=> {
          const { openid, ID, show } = data.result || {}
          if(openid) {
            this.globalData.show = show
            this.globalData.ID = openid
            this.globalData.User = ID === openid
            cb()
          }
        }).catch((err)=> {
           wx.showToast({
            title: '登陆失败',
            icon: 'none',
            duration: 2000
          })
        }).finally(()=> {
          wx.hideLoading()
        })
      }
      //获取当前日期
      this.getCurrentDate = function(num=0,timer) {
        const date = new Date()
        date.setDate(date.getDate()+num)
        const years = date.getFullYear()
        let months = date.getMonth()+1
        months = months>9?months:'0'+months
        const days = date.getDate()
        let val = [years,months,days].join('-')
        if(timer) {//需要时分秒
          let h = date.getHours()
          h = h>9?h:'0'+h
          let m = date.getMinutes()
          m = m>9?m:'0'+m
          let s = date.getSeconds()
          s = s>9?s:'0'+s
          val+= ' '+h+':'+m+':'+s
        }
        return val
      }
      //订阅消息方法
      this.confirmSendMsg = function(tmplId, cb=()=> {}) {
        wx.requestSubscribeMessage({
          tmplIds: [tmplId],
          success (res) {
          },
          fail(error) {
          },
          complete() {
            cb()
          }
        })
      }
    }
  }
})
