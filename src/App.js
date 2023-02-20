// myspug\src\App.js

import { Component } from 'react';
// 登录组件
import Login from './pages/login';
// 模拟 Layout 组件
import Layout from './layout'
import { Switch, Route } from 'react-router-dom';

// 定义一个类组件
class App extends Component {
  render() {
    return (
      // 只渲染其中一个 Route
      // exact 精确匹配
      // component={Login} 路由组件（不同于一般组件，其 props 中有路由相关方法。）
      <Switch>
        <Route path="/" exact component={Login} />
        {/* 没有匹配则进入 Layout */}
        <Route component={Layout} />
      </Switch>
    );
  }
}

export default App;