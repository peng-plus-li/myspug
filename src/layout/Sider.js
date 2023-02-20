// spug\src\layout\Sider.js

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { hasPermission, history } from '@/libs';
import styles from './layout.module.less';
/*
对象数组。就像这样：

[
  { icon: <DesktopOutlined />, title: '工作台', path: '/home', component: HomeIndex },
  ...
  {
    icon: <AlertOutlined />, title: '报警中心', auth: 'alarm.alarm.view|alarm.contact.view|alarm.group.view', child: [
      { title: '报警历史', auth: 'alarm.alarm.view', path: '/alarm/alarm', component: AlarmIndex },
      { title: '报警联系人', auth: 'alarm.contact.view', path: '/alarm/contact', component: AlarmContact },
      { title: '报警联系组', auth: 'alarm.group.view', path: '/alarm/group', component: AlarmGroup },
    ]
  },
  ...
]
*/
import menus from '../routes';

import logo from './spug.png'

let selectedKey = window.location.pathname;
/*
菜单映射。如果输入不存在的路径，那么菜单就不需要选中

{
/home: 1,                   // 一级菜单
/dashboard: 1,              // 一级菜单
...
/alarm/alarm: "报警中心",   // 二级菜单
/alarm/contact: "报警中心", // 二级菜单
/alarm/group: "报警中心",   // 二级菜单
...
}
*/
const OpenKeysMap = {};

for (let item of menus) {
  if (item.child) {
    for (let sub of item.child) {
      // child 中的节点值为 item.title
      if (sub.title) OpenKeysMap[sub.path] = item.title
    }
  } else if (item.title) {
    // 一级节点的值是 1
    OpenKeysMap[item.path] = 1
  }
}

export default function Sider(props) {
  // 根据路由返回菜单项或子菜单。没有权限或没有 title 返回 null
  function makeMenu(menu) {
    // 如果没有权限
    if (menu.auth && !hasPermission(menu.auth)) return null;
    // 没有 title 返回 null
    if (!menu.title) return null;
    // 如果有 child 则调用 _makeSubMenu；没有 child 则调用 _makeItem
    return menu.child ? _makeSubMenu(menu) : _makeItem(menu)
  }

  // 返回子菜单
  function _makeSubMenu(menu) {
    return (
      <Menu.SubMenu key={menu.title} title={<span>{menu.icon}<span>{menu.title}</span></span>}>
        {menu.child.map(menu => makeMenu(menu))}
      </Menu.SubMenu>
    )
  }

  // 返回菜单项
  function _makeItem(menu) {
    return (
      <Menu.Item key={menu.path}>
        {menu.icon}
        <span>{menu.title}</span>
      </Menu.Item>
    )
  }
  // window.location.pathname 返回当前页面的路径或文件名
  // 例如 https://demo.spug.cc/host?name=pjl 返回 /host
  const tmp = window.location.pathname;
  const openKey = OpenKeysMap[tmp];
  // 如果是不存在的路径（例如 /host9999），菜单则无需选中
  if (openKey) {
    // 当前选中的菜单项 key 数组。
    selectedKey = tmp;
  }
  // 下面的className都仅仅让样式好看点,对功能没有影响。
  return (
    // Sider：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中。
    // collapsed - 当前收起状态。这里设置为默认展开
    <Layout.Sider width={208} collapsed={props.collapsed} className={styles.sider}>
      {/* 图标 */}
      <div className={styles.logo}>
        <img src={logo} alt="Logo" style={{ height: '30px' }} />
      </div>
      <div className={styles.menus} style={{ height: `${document.body.clientHeight - 64}px` }}>
        {/* 导航菜单。使用的是`缩起内嵌菜单` */}
        <Menu
          // defaultOpenKeys - 初始展开的 SubMenu 菜单项 key 数组
          // fix: 刷新页面后展开菜单项
          defaultOpenKeys={[openKey]}
          theme="dark"
          mode="inline"
          className={styles.menus}
          // 当前选中的菜单项 key 数组
          selectedKeys={[selectedKey]}
          // 路由切换。点击哪个导航，url和路由就会切换到该路劲
          onSelect={menu => history.push(menu.key)}>
          {/* 数组中的 null 会被忽略 */}
          {menus.map(menu => makeMenu(menu))}
        </Menu>
      </div>
    </Layout.Sider>
  )
}