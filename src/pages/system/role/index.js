// myspug\src\pages\system\role\index.js

import React from 'react';
import { observer } from 'mobx-react';
import { Input, Button, } from 'antd';
import ComTable from './Table';
import { AuthDiv, SearchForm, } from '@/components';
import store from './store';
import ComForm from './Form';

export default observer(function () {
  return (
    <AuthDiv auth="system.role.view">
      <SearchForm>
        <SearchForm.Item span={6} title="角色名称">
          <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入" />
        </SearchForm.Item>
        <SearchForm.Item span={6}>
          <Button type="primary" onClick={() => {
            // 重置为第一页
            store.setCurrent(1)
            store.fetchRecords();
          }}>查询</Button>
        </SearchForm.Item>
      </SearchForm>
      <ComTable />
      {/* formVisible 控制表单显示 */}
      {store.formVisible && <ComForm />}
    </AuthDiv>
  )
})
