// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type, train, pageIndex, data } = event
  if(type==='add') {//增加申请
    const { name, no, card } = data
    if(!train) {//不是培训阶段提交
      const dataObj = await db.collection('applyList')
        .where({name,no,card})
        .limit(1)
        .get()
      if(!dataObj || !dataObj.data.length) {//首次进入
        return
      }
    }
    //培训通过后提交
    const approve = await getApprove(data)//审批部门列表
    emitApply(approve[0])//先让第一个部门审批
    data.status = approve
    data.openid = wxContext.OPENID
    return await db.collection('applyList')
        .add({
          data
        })
  }else if(type === 'get') {//获取申请列表
    const openid = wxContext.OPENID
    return await db.collection('applyList')
        .where({openid})
        .skip(5*((pageIndex||1)-1))// 跳过结果集中的前 5 条，从第 6 条开始返回
        .limit(5)
        .get()
  }
  return {}
}
async function emitApply(depart) {
  const data = await db.collection('approveUsers')
         .where({
          depart
        })
        .field({
          openid: true
        })
        .get()
  //
  const obj = await db.collection('applyInfo').get()
  const {ID, env} = obj.data[0]
  data.data.forEach(({openid})=> {//发送审批单子
    cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId: '7s0AjANAHq6TjpeMMaVd01i57Vg_X36kNGgvOI2fpYU',
      data: { 
        "thing11": { value: '外部人员来访审批'  }, //事由
        "thing6": { value: depart } //备注
      },
      miniprogramState: env,
      page:'pages/approve/approve'
    })
  })
}
//
async function getApprove({type,leanType,typeRes,person,genPics}) {
  if(typeRes==='4') {//器械
    if(genPics&&genPics.length) {//有跟台证
      typeRes = '3'
    }else {
      typeRes = '1'
    }
  }
  const data = await db.collection('approveTypes')
         .where({
          type,leanType,typeRes,person
        })
        .field({
          approve: true
        })
        .limit(1)
        .get()
  //
  return data.data[0].approve
}