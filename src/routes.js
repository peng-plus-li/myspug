// myspug\src\routes.js

import React from 'react';
import {
  DesktopOutlined,
  AlertOutlined,
} from '@ant-design/icons';

import HomeIndex from './pages/home';
// 占位效果
/*
// myspug\src\pages\alarm\alarm\index.js
export default function AlarmCenter() {
    return <div>报警中心占位符 - {window.location.pathname}</div>
}
*/
import AlarmCenter from './pages/alarm/alarm';
// 个人中心
import WelcomeInfo from './pages/welcome/info';
// 系统角色
import SystemRole from './pages/system/role'

export default [
  { icon: <DesktopOutlined />, title: '工作台', path: '/home', component: HomeIndex },
  {
    icon: <AlertOutlined />, title: '报警中心', auth: 'alarm.alarm.view|alarm.contact.view|alarm.group.view', child: [
      { title: '报警历史', auth: 'alarm.alarm.view', path: '/alarm/alarm', component: AlarmCenter },
      { title: '报警联系人', auth: 'alarm.contact.view', path: '/alarm/contact', component: AlarmCenter },
      { title: '报警联系组', auth: 'alarm.group.view', path: '/alarm/group', component: AlarmCenter },
    ]
  },
  {
    icon: <AlertOutlined />, title: '系统管理', auth: "system.role.view", child: [
      { title: '角色管理', auth: 'system.role.view', path: '/system/role', component: SystemRole },
    ]
  },
  { path: '/welcome/info', component: WelcomeInfo },
]
