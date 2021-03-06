//
export const rules = [
  {
    name: 'name',
    rules: {required: true, message: '请输入姓名'},
  },
  {
    name: 'mobile',
    rules: {mobile: true, message: '请输入正确手机号'},
  },
  {
    name: 'date',
    rules: {required: true, message: '请输入日期'},
  },
  {
    name: 'compy',
    rules: {required: true, message: '请输入单位'},
  },
  {
    name: 'job',
    rules: {required: true, message: '请输入职业'},
  },
  {
    name: 'no',
    rules: {required: true, message: '请输入工号'},
  },
  {
    name: 'noPics',
    rules: {validator: function(rule, value) {
      if (!value.length) {
        return '请上传工作证照片'
      }
    }}
  },
  {
    name: 'card',
    rules: {validator: function(rule, value) {
        if (!value || value.length !== 18) {
        return '请输入18位的身份证号码'
        }
    }}
  },
  {
    name: 'cardPics',
    rules: {validator: function(rule, value) {
      if (!value.length) {
        return '请上传身份证照片'
      }
    }}
  },
  {
    name: 'jkPics',
    rules: {validator: function(rule, value) {
      if (!value.length) {
        return '请上传健康码照片'
      }
    }}
  },
  {
    name: 'xcPics',
    rules: {validator: function(rule, value) {
      if (!value.length) {
        return '请上传行程码照片'
      }
    }}
  },
  {
    name: 'ymPics',
    rules: {validator: function(rule, value) {
      if (!value.length) {
        return '请上传疫苗接种照片'
      }
    }}
  },
  {
    name: 'illName',
    rules: {required: true, message: '请输入患者姓名'},
  },
  {
    name: 'bedNo',
    rules: {required: true, message: '请输入床号'},
  },
  {
    name: 'hospitalNo',
    rules: {required: true, message: '请输入住院号'},
  },
  {
    name: 'operationName',
    rules: {required: true, message: '请输入手术名称'},
  },
  {
    name: 'deviceName',
    rules: {required: true, message: '请输入设备名称'},
  },
  {
    name: 'purpose',
    rules: {required: true, message: '请输入进入目的'},
  }
]
//
export const typesList = ['手术跟台', '手术交流', '设备维护维修', '参观学习','其他']
export const formData = {
  personType: '1',// 1 非本院职工 2 本院职工
  name: null,//姓名
  mobile: null,//手机号码
  date: null,//选择进入时间
  no: null,//本院职工工号
  sex:  '1',// 1 男 2 女
  card: null,//身份证号码
  type: '0',//0 1 2 3 4 进入手术室目的
  illName: null,//患者姓名
  bedNo: null,//床号
  hospitalNo: null,//住院号
  operationName: null,//手术名称
  typeRes: '1',//跟台原因 1:设备相关 2:耗材相关 3:标本相关 4:器械相关
  deviceName: null,//描述设备名称
  purpose: null,//其他进入目的
  leanType: '1',//学习类型 1: 进修 2 培训 3 实训
  person: '1',//1 医生 2 护士 
  compy: null,//单位
  job: null,//职业
  ill1: '1',//传染病
  ill2: '1',//呼吸道病
  ill3: '1',//创伤
  ill4: '1',//医学背景
  noPics: [],//工作证照片 [{url:xxx}]
  cardPics: [],//身份证照片 
  jkPics: [],//健康码
  xcPics: [],//行程码
  ymPics: [],//疫苗接种
  genPics: [],//跟台证
}
export async function getParamsData(formData,upload) {//根据类型不同返回
  const { personType,name,mobile,date,no,sex,card,type,compy,job,
    ill1,ill2,ill3,ill4,noPics,cardPics,jkPics,xcPics,ymPics,genPics,typeRes
  } = formData
  if(personType==='1') {//非本院职工
    if(upload) {
      for(let pics of [cardPics,jkPics,xcPics,ymPics,typeRes==='4'?genPics:[]]) {
        if(pics.length) {
          const res = await uploadFile(date+'/'+card+'/', pics[0].url)
          if(res.fileID) {
            pics[0].url = res.fileID
          }else {
            return false
          }
        }
      }
    }
    return {
      name,mobile,date,sex,card,cardPics,jkPics,xcPics,ymPics,compy,job,ill1,ill2,ill3,ill4,type,...objTypeFun(formData)
    }
  }
  if(upload) {
    for(let pics of [noPics,typeRes==='4'?genPics:[]]) {
      if(pics.length) {
        const res = await uploadFile(date+'/'+no+'/', pics[0].url)
        if(res.fileID) {
          pics[0].url = res.fileID
        }else {
          return false
        }
      }
    }
  }
  return {//本院职工
    name,mobile,date,no,noPics,type,...objTypeFun(formData)
  }
}
function uploadFile(cloudPath,filePath) {
  cloudPath += (new Date().getTime())+filePath.match(/\.[^.]+?$/)[0]
  return new Promise((resolve ,reject)=> {
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
function objTypeFun(formData) {
  const { type, illName,bedNo,hospitalNo,operationName,typeRes,deviceName,leanType,purpose,person,genPics } = formData
  if(type==='0' || type==='1') {//'手术跟台', '手术交流'
    const obj = {illName,bedNo,hospitalNo,operationName}
    if(type==='0') {
      obj.typeRes = typeRes
      if(typeRes==='4') {//器械
        obj.genPics = genPics
      }
    }
    return obj
  }
  if(type==='2') {//设备维护维修
    return {deviceName}
  }
  if(type==='3') {//参观学习
    // if(leanType==='1') {//进修
    //   return {leanType,person}
    // }
    return {leanType,person}
  }
  if(type==='4') {//其他
    return {purpose}
  }
  return {}
}
const trainContent = [{
  title: '下列哪项不是手术室的分区？',
  answer: '跨越区',
  options: ['限制区','半限制区','非限制区','跨越区']
},{
  title: '手术房间属于以下哪个区域？',
  answer: '限制区',
  options: ['限制区','半限制区','非限制区']
},{
  title: '进入限制区下列说法错误的是',
  answer: '可将饮水杯等生活用品带入限制区',
  options: ['可将饮水杯等生活用品带入限制区','需更换洗手衣裤、佩戴一次性手术帽、换专用手术鞋、戴一次性口罩'
  ,'不可将洗手衣裤、手术室专用拖鞋穿出手术室','不可在手术区域大声谈笑、随意坐卧']
},{
  title: '离开手术室前，应将洗手衣裤、专用拖鞋丢弃于',
  answer: '更衣室的指定地方',
  options: ['更衣室的指定地方','随地丢弃','黑色垃圾袋','黄色垃圾袋']
},{
  title: '以下有关在手术室内行为规范的描述错误的是',
  answer: '在手术室内可随意拍照',
  options: ['参观手术时不可紧贴手术人员，需保持一定的距离','未经巡回护士允许不得随意进出正在手术的房间'
  ,'在手术室内可随意拍照','未经允许不得将手术相关物品拿进或拿出手术室']
}]
//
export const getTrainContent = ()=> {
  trainContent.sort(()=> {
    return Math.random() - 0.5
  }).forEach(({options},idx,list)=> {
      list[idx].options = options.sort(()=> {
        return Math.random() - 0.5
      })
  })
  return trainContent
}
