// myspug\src\pages\login\index.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Modal, message } from 'antd';
import { UserOutlined, LockOutlined, CopyrightOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import styles from './login.module.css';
// 调整下引用路径：libs/history 改成 @/libs/history
import history from '@/libs/history';
import { http, updatePermissions } from '@/libs';

// 函数组件
export default function () {
    // antd 官网：我们推荐使用 Form.useForm 创建表单数据域进行控制。如果是在 class component 下，你也可以通过 ref 获取数据域。（https://ant.design/components/form-cn#components-form-demo-control-ref）
    // FormInstance 经 Form.useForm() 创建的 form 控制实例。FormInstance 有一系列方法，例如
    // 注：useForm 是 React Hooks 的实现，只能用于函数组件，class 组件请查看下面的例子（https://ant.design/components/form-cn#components-form-demo-control-hooks）
    const [form] = Form.useForm();
    // 验证码倒计时
    const [counter, setCounter] = useState(0);
    // 控制登录按钮
    const [loading, setLoading] = useState(false);
    // 登录类型默认是 default
    const [loginType, setLoginType] = useState('default');
    // 验证码。默认关闭。笔者将其开启
    const [codeVisible, setCodeVisible] = useState(false);
    const [codeLoading, setCodeLoading] = useState(false);

    // 相当于 componentDidMount() 和 componentDidUpdate()（counter 变化时会执行）
    // 定时器，重新获取验证码倒计时。
    useEffect(() => {
        setTimeout(() => {
            // 默认是 0，故不会执行。当设置有效值时会执行，例如 30
            if (counter > 0) {
                setCounter(counter - 1)
            }
        }, 1000)
    }, [counter])

    // 登录
    function handleSubmit() {
        // getFieldsValue - 获取一组字段名对应的值，会按照对应结构返回
        // form 是 FormInstance。
        const formData = form.getFieldsValue();
        // 如果显示了“验证码”却没有输入，提示
        if (codeVisible && !formData.captcha) return message.error('请输入验证码');

        // 登录中...
        setLoading(true);
        // 设置登录类型：default 或 ldap
        formData['type'] = loginType;

        // formData2 {username: '1', password: '2', captcha: '3', type: 'default'}
        console.log('formData2', formData)

        http.post('/api/account/login/', formData)
            // 官网返回： {"data": {"id": 1, "access_token": "4b6f1a9b8d824908abb9613695de57f8", "nickname": "\u7ba1\u7406\u5458", "is_supper": true, "has_real_ip": true, "permissions": []}, "error": ""}
            .then(data => {
                // 某种处理逻辑，我们可以去除这个分支
                if (data['required_mfa']) {
                    setCodeVisible(true);
                    setCounter(30);
                    setLoading(false)
                } else if (!data['has_real_ip']) { // 用户请求时没有真实ip则安全警告
                    Modal.warning({
                        title: '安全警告',
                        className: styles.tips,
                        content: <div>
                            未能获取到访问者的真实IP，无法提供基于请求来源IP的合法性验证，详细信息请参考
                            <a target="_blank"
                                href="https://spug.cc/docs/practice/"
                                rel="noopener noreferrer">官方文档</a>。
                        </div>,
                        onOk: () => doLogin(data)
                    })
                } else {
                    doLogin(data)
                }
            }, () => setLoading(false))
    }

    // 将登录返回的数据存入本地，并更新权限和 token
    function doLogin(data) {
        // id
        localStorage.setItem('id', data['id']);
        // token
        localStorage.setItem('token', data['access_token']);
        // 昵称
        localStorage.setItem('nickname', data['nickname']);
        // is_supper
        localStorage.setItem('is_supper', data['is_supper']);
        // 权限
        localStorage.setItem('permissions', JSON.stringify(data['permissions']));

        // 权限和 token 相关。
        updatePermissions();
        // 登录成功则进入系统主页或未登录前访问的页面
        // 更具体就是：切换 Url。进入主页或登录前的页面（记录在 from 中）
        // react通过history.location.state来携带参数
        // 例如 spug\src\libs\http.js 中的：history.push('/', {from: history.location})
        if (history.location.state && history.location.state['from']) {
            history.push(history.location.state['from'])
        } else {
            history.push('/home')
        }
    }

    // 获取验证码
    function handleCaptcha() {
        // 请求中...
        setCodeLoading(true);
        const formData = form.getFieldsValue(['username', 'password']);
        formData['type'] = loginType;
        // formData {username: '1', password: '2', type: 'default'}
        console.log('formData', formData)
        http.post('/api/account/login/', formData)
            // 30 秒后获得验证码
            .then(() => setCounter(30))
            .finally(() => setCodeLoading(false))
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                {/* 仅做样式，默认选中第一个 tabpane。没有选项卡内容 */}
                <Tabs className={styles.tabs} onTabClick={v => setLoginType(v)}>
                    <Tabs.TabPane tab="普通登录" key="default" />
                    <Tabs.TabPane tab="LDAP登录" key="ldap" />
                </Tabs>
                {/* 使用 Form.useForm 创建表单数据域进行控制 */}
                <Form form={form}>
                    <Form.Item name="username" className={styles.formItem}>
                        <Input
                            size="large"
                            // 关闭自动完成的选项
                            autoComplete="off"
                            placeholder="请输入账户"
                            // 人头像的 icon
                            prefix={<UserOutlined className={styles.icon} />} />
                    </Form.Item>
                    <Form.Item name="password" className={styles.formItem}>
                        <Input
                            size="large"
                            type="password"
                            autoComplete="off"
                            placeholder="请输入密码"
                            // 按下回车的回调。即提交
                            onPressEnter={handleSubmit}
                            // 锁的icon
                            prefix={<LockOutlined className={styles.icon} />} />
                    </Form.Item>
                    {/* 验证码。默认关闭 */}
                    {/* 这里展示了 Form.Item 嵌套用法 */}
                    <Form.Item hidden={!codeVisible} name="captcha" className={styles.formItem}>
                        <div style={{ display: 'flex' }}>
                            <Form.Item noStyle name="captcha">
                                <Input
                                    size="large"
                                    autoComplete="off"
                                    placeholder="请输入验证码"
                                    prefix={<MailOutlined className={styles.icon} />} />
                            </Form.Item>
                            {counter > 0 ? (
                                <Button disabled size="large" style={{ marginLeft: 8 }}>{counter} 秒后重新获取</Button>
                            ) : (
                                <Button size="large" loading={codeLoading} style={{ marginLeft: 8 }}
                                    onClick={handleCaptcha}>获取验证码</Button>
                            )}
                        </div>
                    </Form.Item>
                </Form>

                <Button
                    // block 属性将使按钮适合其父宽度。
                    block
                    size="large"
                    type="primary"
                    className={styles.button}
                    loading={loading}
                    onClick={handleSubmit}>登录</Button>
            </div>
            {/* 网站底部统一信息。这里是`官网`、`github 地址`、`文档` */}
            <div className={styles.footerZone}>
                <div className={styles.linksZone}>
                    <a className={styles.links} title="官网" href="https://spug.cc" target="_blank"
                        rel="noopener noreferrer">官网</a>
                    <a className={styles.links} title="Github" href="https://github.com/openspug/spug" target="_blank"
                        rel="noopener noreferrer"><GithubOutlined /></a>
                    <a title="文档" href="https://spug.cc/docs/about-spug/" target="_blank"
                        rel="noopener noreferrer">文档</a>
                </div>
                <div style={{ color: '#fff' }}>Copyright <CopyrightOutlined /> {new Date().getFullYear()} By Spug</div>
            </div>
        </div>
    )
}
