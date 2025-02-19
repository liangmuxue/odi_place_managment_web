/***** 引入全局组件 *****/
import ImgPortrait from './Common/ImgPortrait' //图片组件，对图片进行简单的加载错误及无图处理
import NumberTransform from './Common/NumberTransform' //数字滚动组件
import Empty from './Common/Empty' //暂无数据组件
import BackToTop from './Common/BackToTop' //回到顶部组件
import TimePicker from './TimePicker/index' //时间选择器
import DatePicker from './TimePicker/index_date' //日期选择器
import ImgPortrait3 from './Common/ImgPortrait3' //图片组件，对图片进行简单的加载错误及无图处理


const components = {
  ImgPortrait,
  NumberTransform,
  ImgPortrait3,
  Empty,
  BackToTop,
  TimePicker,
  DatePicker
}

const commonComponents = function (Vue) {
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
    Vue.use(key);
  })

}

export default commonComponents
