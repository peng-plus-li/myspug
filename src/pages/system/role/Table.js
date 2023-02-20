
// myspug\src\pages\system\role\Table.js

import React from 'react';
import { observer } from 'mobx-react';
import { Button, } from 'antd';
// PlusOutlined：antd 2.2.8 找到 
import { PlusOutlined } from '@ant-design/icons';
import { TableCard, AuthButton, } from '@/components';
import store from './store';

@observer
class ComTable extends React.Component {
  componentDidMount() {
    store.fetchRecords()
  }
  columns = [{
    title: '角色名称',
    dataIndex: 'name',
  }, {
    title: '关联账户',
    render: info => 0
  }, {
    title: '描述信息',
    dataIndex: 'desc',
    ellipsis: true
  }, {
    title: '操作',
    width: 400,
    render: info => (
      <Button size="small" type="primary" onClick={() => store.showForm(info)}>编辑</Button>
    )
  }];

  handleTableChange = ({ current }, filters, sorter) => {
    store.current = current
    store.tableOptions = {
      // 排序：好像只支持单个排序
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    }
    store.fetchRecords();
  };


  render() {
    return (
      <TableCard
        rowKey="id"
        title="角色列表"
        loading={store.isFetching}
        // 后端的数据源
        dataSource={store.dataSource}
        onReload={store.fetchRecords}
        onChange={this.handleTableChange}
        actions={[
          <AuthButton type="primary" icon={<PlusOutlined />} auth="system.role.add" onClick={() => store.showForm()}>新增</AuthButton>
        ]}
        // 分页器
        pagination={{
          showSizeChanger: true,
          showLessItems: true,
          showTotal: total => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
          // 如果不传 total，则以后端返回数据条数作为 total 的值
          total: store.total,
          // 如果不传，则默认是第一条，如果需要默认显示第3条，则必须传
          current: store.current,
        }}
        columns={this.columns} />
    )
  }
}

export default ComTable
