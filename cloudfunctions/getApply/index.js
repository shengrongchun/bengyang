// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
//const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, data } = event
  if(type==='add') {//增加申请
    const {name,no,card} = data
    await db.collection('applyList')
        .add({
          data
        })
    return await db.collection('applyList')
        .where({
          name,
          no,card
        })
        .limit(2)
        .get()
  }
  return {}
}