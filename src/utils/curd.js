/**
Created by caoxinyu
20191011
 */
import {
  type
} from './index' // type判断传入值的类型，比typeof更详细
export default {
  install(Vue) {
    // 用于打开增加框，方法能重置表单，并使表单内容回到初始化状态。
    // 传入参数
    // 1）表单名称，字符串形式如'form'，必须
    // 2) 打开表单后需要做什么，可以传数组[this.dialogvisiale = false， fetchData],也可以传回调函数function() { this.dialogvisiale = false } 可选

    Vue.prototype.$addForm = function (form, callback) {
      if (type(form) === 'string') {
        if (this.$refs[form]) { // 判断是否需要重置表单，如果需要重置表单
          this.$refs[form].resetFields()
        }
        if (type(callback) === 'array') { // 判断传入是否为数组，如果是遍历数组，遇到函数将函数体变成函数执行，其余正常执行
          if (callback && callback.length !== 0) {
            for (let i = 0, len = callback.length; i < len; i++) {
              typeof callback[i] === 'function' ? callback[i]() : callback[i]
            }
          }
        } else if (type(callback) === 'function') { // 判断传入是否为回调函数
          callback.call(this) // 回调函数执行，需将this改为该组件
        }
        this[form] = Object.assign(this.$data[form], this.$options.data()[form]) // 将表单中的数据变为初始状态。其中,this.$options.data是所有初始化的数据，this.$data是目前的数据
      } else {
        console.error('传入参数错误')
      }
    }
    // 用于打开编辑框，方法能自动传入行的数据到对应的表单中,并将表单中所有纯数字转成int。前提是行的名称需跟表单名称一样。
    // 传入参数
    // 1) 编辑这一行的row
    // 2）表单名称，字符串形式如'form'
    // 3) 打开编辑需要做什么，同样是[] 和 function
    Vue.prototype.$editForm = function (row, form, callback) {
      if (type(row) === 'object' && type(form) === 'string') {
        if (this.$refs[form]) { // 判断是否需要重置表单
          this.$refs[form].resetFields()
        }
        const isNum = /^[0-9]+$/ // 正则表达式，是否全都为纯数字
        for (const prop in this[form]) { // 遍历表单，当表单和row中属性名一样时，表单row中的属性赋值给form
          isNum.lastIndex = 0 // 正则每一次匹配后的索引归0，否则循环会造成问题
          isNum.exec(row[prop]) ? this[form][prop] = parseInt(row[prop]) : this[form][prop] = row[prop] // 通过正则匹配数字，当匹配成功后，将字符串转为int。当然你也不用担心空转成NaN,因为''匹配通不过！
        }
        if (type(callback) === 'array') { // 这部分处理与打开表单相同
          if (callback && callback.length !== 0) {
            for (let i = 0, len = callback.length; i < len; i++) {
              typeof callback[i] === 'function' ? callback[i]() : callback[i]
            }
          }
        } else if (type(callback) === 'function') {
          callback.call(this)
        }
      } else {
        console.error('传入参数错误')
      }
    }
    // 用于获取下拉框中的数据
    // 传入参数
    // 1）请求数据函数引用如getXXX，必须
    // 2）数组的实行名称['XXXX名称', 'XXXX代码']，必须
    // 3）需要用哪个数组接收这个结果，字符串形式。如在组件也需要用this.select,传入值就为'select'，必须
    // 4) 请求函数传入的参数，可选
    Vue.prototype.$getSelect = function (requestData, select, carrier, param) {
      if (type(requestData) === 'function' && type(select) === 'array' && type(carrier) === 'string') {
        if (type(param) === 'array') {
          requestData(...param).then(response => { // 这个方法没什么难度，不注释了
            this[carrier] = []
            for (let i = 0, len = response.data.length; i < len; i++) {
              if (select.length === 2) {
                this[carrier].push({
                  label: response.data[i][select[0]],
                  value: response.data[i][select[1]]
                })
              } else {
                this[carrier].push({
                  value: response.data[i][select[0]]
                })
              }
            }
          })
        } else {
          requestData(param).then(response => { // 这个方法没什么难度，不注释了
            this[carrier] = []
            for (let i = 0, len = response.data.length; i < len; i++) {
              if (select.length === 2) {
                this[carrier].push({
                  label: response.data[i][select[0]],
                  value: response.data[i][select[1]]
                })
              } else {
                this[carrier].push({
                  value: response.data[i][select[0]]
                })
              }
            }
          })
        }
      } else {
        console.error('参数传递错误')
      }
    }
    // 普通获取数据
    // 传入参数
    // 1) 请求数据函数引用如getXXX，必须
    // 2) 需要用哪个数组接收这个结果，字符串形式。如在组件也需要用this.select,传入值就为'select'，必须
    // 3) 请求函数传入的参数，可选
    Vue.prototype.$getData = function (requestData, carrier, param) {
      if (type(requestData) === 'function' && type(carrier) === 'string') {
        if (type(param) === 'undefined') {
          requestData(param).then(response => {
            const data = response.data
            this[carrier] = data
          })
        } else {
          let Param = []
          if (type(param) !== 'array') {
            Param.push(param)
          } else {
            Param = param
          }
          requestData(...Param).then(response => {
            const data = response.data
            this[carrier] = data
          })
        }
      } else {
        console.error('传入参数错误')
      }
    }
    // 获取表格数据,将表格中的年月日时分秒，转换成年月日
    // 传入参数
    // 1）请求数据函数引用如getXXX，必须
    // 2）请求的参数，可选
    // 3）接受值，数组，一般是['table','total','loading']顺序不能变
    Vue.prototype.$getTable = function (requestData, param, e) {
      requestData(...param).then(response => {
        const data = response.data.rows
        this[e[0]] = []
        this[e[1]] = 0
        if (data && data.length > 0) {
          const isTime = /^\d{4}([-\/.])\d{1,2}\1\d{1,2}/ // 判断是否是时间的正则表达式
          for (let i = 0, len = data.length; i < len; i++) { // 循环得到每一条数据
            for (const prop in data[i]) { // 循环每一条的每一项
              isTime.lastIndex = 0 // 正则每一次指针复位
              if (isTime.test(data[i][prop])) { // 判断是否是时间，如果是切割
                data[i][prop] = data[i][prop].split(' ')[0]
              }
            }
          }
          this[e[0]] = data
          this[e[1]] = parseInt(response.data.total)
        } else {
          this[e[0]] = []
          // console.log('暂无数据')
        }
      }).then(() => {
        this[e[2]] = false
      })
    }
    // 添加表格数据
    // 传入参数
    // 1) 请求数据函数引用如getXXX，必须
    // 2) 请求的参数，可选
    // 3) 验证的表单名称，必须
    // 4) 回调函数，必须
    Vue.prototype.$addTable = function (requestData, param, form, callback) {
      if (type(callback) === 'function' && type(requestData) === 'function' && type(form) === 'string') {
        console.log(this.$refs[form])
        this.$refs[form].validate((valid) => {
          console.log(valid)
          if (valid) {
            requestData(...param).then(response => {
              if (response.data[0].result === '1') {
                this.$message.success('增加成功')
                callback.call(this)
              } else {
                this.$message.error('增加失败')
              }
            })
          } else {
            console.error('error submit!!')
            return false
          }
        })
      } else {
        console.error('参数传递错误')
      }
    }
    // 编辑表格数据
    // 传入参数
    // 1) 请求数据函数引用如getXXX，必须
    // 2) 请求的参数，可选
    // 3) 验证的表单名称，必须
    // 4) 回调函数，必须
    Vue.prototype.$editTable = function (requestData, param, form, callback) {
      if (type(callback) === 'function' && type(requestData) === 'function' && type(form) === 'string') {
        this.$refs[form].validate((valid) => {
          if (valid) {
            requestData(...param).then(response => {
              if (response.data[0].result === '1') {
                this.$message.success('修改成功')
                callback.call(this) // 回调函数修正this指向组件本身
              } else {
                this.$message.error('修改失败')
              }
            })
          } else {
            console.error('error submit!!')
            return false
          }
        })
      } else {
        console.error('参数传递错误')
      }
    }
    // 删除表格数据
    // 传入参数
    // 1) 请求数据函数引用如getXXX，必须
    // 2) id传入删除条件，必须
    // 3) 回调函数，必须
    Vue.prototype.$deleteRow = function (requestData, query, callback) {
      if (type(callback) === 'function' && type(requestData) === 'function') {
        if (this.tableData && this.tableData.length === 1 && this.pageCurrent > 1) { // 判断删除的是否是最后一页最后一行，如果是且不是第一页，页数减一
          this.pageCurrent--
        }
        this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          requestData(query).then(response => {
            if (response.code === 200) {
              this.$message.success('请求成功')
              callback.call(this) // 回调函数修正this指向组件本身
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        console.error('参数传递错误')
      }
    }
  }
}
