// myspug\src\pages\system\role\Form.js
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Input, message } from 'antd';
import http from '@/libs/http';
import store from './store';

export default observer(function () {
    // 文档中未找到这种解构使用方法
    const [form] = Form.useForm();
    // useState 函数组件中使用 state
    // loading 默认是 flase
    const [loading, setLoading] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    function handleSubmit() {
        // 取得表单字段的值
        const formData = form.getFieldsValue();

        if(formData.name && (/\s+/g).test(formData.name)){
            message.error('名字不允许有空格')
            return
        }
        if(formData.tel && (/\s+/g).test(formData.tel)){
            message.error('电话不允许有空格')
            return
        }

        setLoading(true);
        
        // 新建时 id 为 undefined
        formData['id'] = store.record.id;
        http.post('/api/account/role/', formData)
            .then(res => {
                message.success('操作成功');
                store.formVisible = false;
                store.fetchRecords()
            }, () => setLoading(false))
    }

    function emptyValid() {
        const formData = form.getFieldsValue();
        const { name, tel } = formData;
        const isNotEmpty = !!(name && tel);
        setCanSubmit(isNotEmpty)
    }

    useEffect(() => {
        // 主动触发，否则编辑时即使都有数据，`确定`按钮扔不可点
        emptyValid()
    }, [])

    return (
        // Modal 对话框
        <Modal
            visible
            maskClosable={false}
            title={store.record.id ? '编辑角色' : '新建角色'}
            onCancel={() => store.formVisible = false}
            confirmLoading={loading}
            // ok 按钮 props
            okButtonProps={{disabled: !canSubmit}}
            onOk={handleSubmit}>
            <Form form={form} initialValues={store.record} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                <Form.Item required shouldUpdate={emptyValid} name="name" label="角色名称">
                    <Input placeholder="请输入角色名称" />
                </Form.Item>
                {/* shouldUpdate - 自定义字段更新逻辑 */}
                {/* 注：需要两个字段都增加 shouldUpdate。如果只有一个，修改该项则不会触发 emptyValid，你可以将 `shouldUpdate={emptyValid}` 放在非必填项中。*/}
                <Form.Item required shouldUpdate={emptyValid} name="tel" label="手机号">
                    <Input placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item name="desc" label="备注信息">
                    <Input.TextArea placeholder="请输入角色备注信息" />
                </Form.Item>
            </Form>
        </Modal>
    )
})