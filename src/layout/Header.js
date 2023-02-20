// myspug\src\layout\Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
//  `通知`暂不实现
//  import Notification from './Notification';
import styles from './layout.module.less';
import http from '../libs/http';
import history from '../libs/history';
import avatar from './avatar.png';

export default function (props) {
  // 退出
  function handleLogout() {
    // 跳转到登录页
    history.push('/');
    // 告诉后端退出登录
    http.get('/api/account/logout/')
  }

  const UserMenu = (
    <Menu>
      <Menu.Item>
        {/* 路由跳转。主体区域对应路由是 `{ path: '/welcome/info', component: WelcomeInfo },` */}
        <Link to="/welcome/info">
          <UserOutlined style={{ marginRight: 10 }} />个人中心
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={handleLogout}>
        <LogoutOutlined style={{ marginRight: 10 }} />退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className={styles.header}>
      {/* 收缩左侧导航按钮 */}
      <div className={styles.left}>
        {/* 点击触发父组件的 toggle 方法 */}
        <div className={styles.trigger} onClick={props.toggle}>
          {/* 根据父组件的 collapsed 属性显示对应图标*/}
          {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      {/* 通知 */}
      <div>通知 todo</div>
      {/* <Notification/> */}
      {/* 用户区域 */}
      <div className={styles.right}>
        <Dropdown overlay={UserMenu} style={{ background: '#000' }}>
          <span className={styles.action}>
            <Avatar size="small" src={avatar} style={{ marginRight: 8 }} />
            {/* 登录后设置过的昵称 */}
            {localStorage.getItem('nickname')}
          </span>
        </Dropdown>
      </div>
    </Layout.Header>
  )
}