// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type, pageIndex, data } = event
  if(type==='get') {//获取审批列表
    const approve = await db.collection('approveUsers')
      .where({openid: wxContext.OPENID})
      .get()
    if(!approve.data.length) {//没有审批权限
      return 
    }
    const approveList = []
    approve.data.forEach(({depart})=> {
      if(!approveList.includes(depart)) {
        approveList.push(depart)
      }
    })
    //
    return await db.collection('applyList')
      .where({
        'status.0': _.in(approveList),
      })
      .skip(5*((pageIndex||1)-1))// 跳过结果集中的前 5 条，从第 6 条开始返回
      .limit(5)
      .get()
  }else if(type==='change') {//更新审批状态
    const { _id, status, type} = data
    const result = await db.collection('applyList')
      .where({
        _id,status
      })
      .limit(1)
      .get()
    if(!result.data.length) {//单子被别人先审批了
      return 
    }
    status.shift()
    const sta = type==='yes'?status: ['驳回']
    //通知申请人，状态变更
    emitApply(result.data[0].openid,sta[0])
    return await db.collection('applyList')
      .where({
        _id
      })
      .update({
        data: {
          status: sta
        }
      })
  }else if(type==='approvePersons') {//获取审核人列表
    const result = await db.collection('approveUsers')
      .skip(10*((pageIndex||1)-1))// 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(10)
      .get()
    return result
  }else if(type==='addApprovePerson') {//添加审核人
    return await db.collection('approveUsers')
        .add({
          data
        })
  }else if(type==='delApprovePerson') {//删除审核人
    const { uniqueId } = data
    return await db.collection('approveUsers')
        .where({
          uniqueId
        }).remove()
  }
  //
  const obj = await db.collection('applyInfo').get()
  const {ID, env} = obj.data[0] || {}
  return {
    ID,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
async function emitApply(openid,status) {
  const obj = await db.collection('applyInfo').get()
  const {ID, env} = obj.data[0]
  cloud.openapi.subscribeMessage.send({
    touser: openid,
    templateId: '2ojePAJOu0rK5v_qgi4A9-ssyoWyYwwUg_RzJy1cBZY',
    data: {
      "phrase2": { value: status || '完成'  }, //申请状态
      "thing5": { value: status || '已完成审批' } //备注
    },
    miniprogramState: env,
    page:'pages/application/application'
  })
}