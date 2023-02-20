// myspug\src\libs\functools.js

// 准许。权限相关。模块私有
let Permission = {
    isReady: false,
    isSuper: false,
    permissions: []
};

//  数组包含关系判断
export function isSubArray(parent, child) {
    for (let item of child) {
        if (!parent.includes(item.trim())) {
            return false
        }
    }
    return true
}

// 由 updatePermissions() 更新
export let X_TOKEN;

// 被入口页（src/index.js）和登录页（src/pages/login/index.js）调用
export function updatePermissions() {
    // 读取 localStorage 项
    // 只在登录时设置：localStorage.setItem('token'
    X_TOKEN = localStorage.getItem('token');
    Permission.isReady = true;
    Permission.isSuper = localStorage.getItem('is_supper') === 'true';
    try {
        Permission.permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    } catch (e) {

    }
}
// 前端页面的权限判断(仅作为前端功能展示的控制，具体权限控制应在后端实现)
export function hasPermission(strCode) {
    const { isSuper, permissions } = Permission;

    if (!strCode || isSuper) return true;
    for (let or_item of strCode.split('|')) {
        if (isSubArray(permissions, or_item.split('&'))) {
            return true
        }
    }
    return false
}


// 基于检测用户代理字符串的浏览器标识是不可靠的，不推荐使用，因为用户代理字符串是用户可配置的
export const isMobile = /Android|iPhone/i.test(navigator.userAgent)