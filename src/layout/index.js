// spug\src\layout\index.js

import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout, message } from 'antd';
// 404 对应的组件
import { NotFound } from '@/components';
// 侧边栏
import Sider from './Sider';
// 头部
import Header from './Header';
// 页脚。例如版权
import Footer from './Footer'

/*
引入路由。对象数组，就像这样：

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
import routes from '../routes';
// hasPermission - 权限判断。本篇忽略，这里直接返回 true; isMobile - 是否是手机
/*
export function hasPermission(strCode) {
    return true
}
// 基于检测用户代理字符串的浏览器标识是不可靠的，不推荐使用，因为用户代理字符串是用户可配置的
export const isMobile = /Android|iPhone/i.test(navigator.userAgent)

*/
import { hasPermission, isMobile } from '@/libs';

// 布局样式，直接拷贝 spug 中的样式即可
import styles from './layout.module.less';

// 将 routes 中有权限的路由提取到 Routes 中
function initRoutes(Routes, routes) {
  for (let route of routes) {
    // 叶子节点才有 component。没有 child 则属于叶子节点
    if (route.component) {
      // 如果不需要权限，或有权限则放入 Routes
      if (!route.auth || hasPermission(route.auth)) {
        Routes.push(<Route exact key={route.path} path={route.path} component={route.component} />)
      }
    } else if (route.child) {
      initRoutes(Routes, route.child)
    }
  }
}

export default function () {
  // 侧边栏收缩状态。默认展开
  const [collapsed, setCollapsed] = useState(false)
  // 路由，默认是空数组
  const [Routes, setRoutes] = useState([]);

  // 组件挂载后执行。相当于 componentDidMount()
  useEffect(() => {
    if (isMobile) {
      // 手机查看时导航栏收起
      setCollapsed(true);
      message.warn('检测到您在移动设备上访问，请使用横屏模式。', 5)
    }

    // 注：重新声明一个变量 Routes，比上文（useState 中的 Routes）的 Routes 作用域更小范围
    const Routes = [];
    initRoutes(Routes, routes);
    setRoutes(Routes)
  }, [])

  return (
    // 此处 Layout 是 antd 布局组件。和官方用法相同：
    /*
    <Layout>
      <Sider>Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
    */
    <Layout>

      {/* 左侧区域，对 antd 中 Sider 的封装 */}
      <Sider collapsed={collapsed} />
      {/* 内容高度不够，版权信息在底部；内容高度太高，则需要滚动才可查看全部内容； */}
      <Layout style={{ height: '100vh' }}>
        {/* 顶部区域， 对 antd 中 Layout.Header 的封装*/}
        <Header collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
        <Layout.Content className={styles.content}>
          {/* 只渲染第一个路径匹配的组件*/}
          <Switch>
            {/* 路由数组。里面每项类似这样：<Route exact key={route.path} path='/home' component={HomeComponent}/> */}
            {Routes}
            {/* 没有匹配则进入 NotFound */}
            <Route component={NotFound} />
          </Switch>
          {/* 系统底部展示。例如版权、官网、文档链接、仓库链接*/}
          <Footer />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
