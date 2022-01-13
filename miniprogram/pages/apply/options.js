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
    name: 'no',
    rules: {required: true, message: '请输入工号'},
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
    name: 'illName',
    rules: {required: true, message: '请输入患者名称'},
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
  },
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
  illName: null,//患者名称
  bedNo: null,//床号
  hospitalNo: null,//住院号
  operationName: null,//手术名称
  typeRes: '1',//跟台原因 1:设备机械相关 2:耗材相关 3:标本相关
  deviceName: null,//描述设备名称
  purpose: null,//其他进入目的
  leanType: '1',//学习类型 1: 进修 2 参观 3 学习
}
export function getParamsData(formData) {//根据类型不同返回
  const { personType,name,mobile,date,no,sex,card,type } = formData
  if(personType==='1') {//非本院职工
    return {
      name,mobile,date,sex,card,type,...objTypeFun(formData)
    }
  }
  return {//本院职工
    name,mobile,date,no,type,...objTypeFun(formData)
  }
}
function objTypeFun(formData) {
  const { type, illName,bedNo,hospitalNo,operationName,typeRes,deviceName,leanType,purpose } = formData
  if(type==='0' || type==='1') {//'手术跟台', '手术交流'
    const obj = {illName,bedNo,hospitalNo,operationName}
    if(type==='0') {
      obj.typeRes = typeRes
    }
    return obj
  }
  if(type==='2') {//设备维护维修
    return {deviceName}
  }
  if(type==='3') {//参观学习
    return {leanType}
  }
  if(type==='4') {//其他
    return {purpose}
  }
  return {}
}