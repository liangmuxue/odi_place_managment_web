// author：caoxinyyu data：2019/10/22
import Vue from 'vue'
import user from "@/store/modules/user"; // has directive
/**权限指令**/
Vue.directive('has', {
    // 当元素被插入父节点时，调用指令判断权限
    inserted: function (el, binding) {
        let red = binding.value.red
        let type = binding.value.type
        const permission = user.state.Permission;
        if (!Vue.prototype.$_has(red, permission, type)) {
            if (type == 1) {
                //若某元素匹配后没由权限则从父节点中移除子元素
                el.parentNode.removeChild(el);
            } else {
                // 若某元素匹配后没由权限则从父节点中禁用子元素（通常为按钮）
                el.disabled = true
                el.style.cursor = 'not-allowed'
                // el.style.backgroundColor = "#f4f4f5"
                // el.style.borderColor = "#e9e9eb"
                el.style.color = "#bcbec2"
            }
        }
    }
});
//权限检查方法，将子元素red标识与vuex中存储的权限列表进行匹配，若匹配成功返回true，否则false
Vue.prototype.$_has = function (red, permission) {
    let isExist = false
    let arr = permission.filter(item => item.resCode === red)
    arr.length === 0 ? isExist = false : isExist = true
    return isExist;
};