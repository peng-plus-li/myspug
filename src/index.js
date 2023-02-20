// myspug\src\index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import { history, updatePermissions } from '@/libs';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './mock'

const root = ReactDOM.createRoot(document.getElementById('root'));

// 权限和 token 相关。
updatePermissions();
root.render(
  // StrictMode 是一个用来突出显示应用程序中潜在问题的工具。与 Fragment 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。
  // 严格模式检查仅在开发模式下运行；它们不会影响生产构建。
  // <React.StrictMode>
    <Router history={history}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Router>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
