// myspug\src\components\TableCard.js

 import React, { useState, useEffect, useRef } from 'react';
 import { Table, Space, Divider, Popover, Checkbox, Button, Input, Select } from 'antd';
 import { ReloadOutlined, SettingOutlined, FullscreenOutlined, SearchOutlined } from '@ant-design/icons';
 import styles from './index.module.less';
 // 从缓存中取得之前设置的列。记录要隐藏的字段。比如之前将 `状态` 这列隐藏
 let TableFields = localStorage.getItem('TableFields')
 
 TableFields = TableFields ? JSON.parse(TableFields) : {}
 
 // 已选择多少项。
 function Footer(props) {
   const actions = props.actions || [];
   const length = props.selected.length;
   return length > 0 ? (
     <div className={styles.tableFooter}>
       <div className={styles.left}>已选择 <span>{length}</span> 项</div>
       <Space size="middle">
         {actions.map((item, index) => (
           <React.Fragment key={index}>{item}</React.Fragment>
         ))}
       </Space>
     </div>
   ) : null
 }
 
 function Header(props) {
   const columns = props.columns || [];
   const actions = props.actions || [];
   // 选中列，也就是表格要显示的列
   const fields = props.fields || [];
   const onFieldsChange = props.onFieldsChange;
 
   // 列展示组件
   const Fields = () => {
     return (
       // value - 指定选中的选项 string[]
       // onChange- 变化时的回调函数 function(checkedValue)。
       // 例如取消`状态`这列的选中
       <Checkbox.Group value={fields} onChange={onFieldsChange}>
         {/* 展示所有的列 */}
         {columns.map((item, index) => (
           // 注：值的选中是根据索引来的，因为 columns 是数组，是有顺序的。
           <Checkbox value={index} key={index}>{item.title}</Checkbox>
         ))}
       </Checkbox.Group>
     )
   }
 
   // 列展示 - 全选或取消全部
   function handleCheckAll(e) {
     if (e.target.checked) {
       // 例如：[0, 1, 2, 3]
       // console.log('columns', columns.map((_, index) => index))
       onFieldsChange(columns.map((_, index) => index))
     } else {
       onFieldsChange([])
     }
   }
 
   // 全屏操作。使用浏览器自带全屏功能
   function handleFullscreen() {
     // props.rootRef.current 是表格组件的原始 Element
     // fullscreenEnabled 属性提供了启用全屏模式的可能性。当它的值是 false 的时候，表示全屏模式不可用（可能的原因有 "fullscreen" 特性不被允许，或全屏模式不被支持等）。
     if (props.rootRef.current && document.fullscreenEnabled) {
       // 如果处在全屏。
       // fullscreenElement 返回当前文档中正在以全屏模式显示的Element节点，如果没有使用全屏模式，则返回null.
       if (document.fullscreenElement) {
         // console.log('退出全屏')
         document.exitFullscreen()
       } else {
         // console.log('全屏该元素')
         props.rootRef.current.requestFullscreen()
       }
     }
   }
 
   // 头部分左右两部分：表格标题 和 options。options 又分两部分：操作项（例如新建、批量删除）、表格操作（刷新表格、表格列显隐控制、表格全屏控制）
   return (
     <div className={styles.toolbar}>
       <div className={styles.title}>{props.title}</div>
       <div className={styles.option}>
         {/* 新建、删除等项 */}
         <Space size="middle" style={{ marginRight: 10 }}>
           {actions.map((item, index) => (
             // 这种用法有意思
             <React.Fragment key={index}>{item}</React.Fragment>
           ))}
         </Space>
         {/* 如果有新建等按钮就得加一个分隔符 | */}
         {actions.length ? <Divider type="vertical" /> : null}
         {/* 表格操作：刷新表格、表格列显隐控制、表格全屏控制 */}
         <Space className={styles.icons}>
           {/* 刷新表格 */}
           <ReloadOutlined onClick={props.onReload} />
           {/* 控制表格列的显示，比如让`状态`这列隐藏 */}
           <Popover
             arrowPointAtCenter
             destroyTooltipOnHide={{ keepParent: false }}
             // 头部：列展示、重置
             title={[
               <Checkbox
                 key="1"
                 // 全选状态。选中的列数 === 表格中定义的列数
                 checked={fields.length === columns.length}
                 // 在实现全选效果时，你可能会用到 indeterminate 属性。
                 // 设置 indeterminate 状态，只负责样式控制
                 indeterminate={![0, columns.length].includes(fields.length)}
                 onChange={handleCheckAll}>列展示</Checkbox>,
               // 重置展示最初的列，也就是页面刚进来时列展示的状态。localStorage 会记录对表格列展示的状态。
               <Button
                 key="2"
                 type="link"
                 style={{ padding: 0 }}
                 onClick={() => onFieldsChange(props.defaultFields)}>重置</Button>
             ]}
             overlayClassName={styles.tableFields}
             // 触发方式是 click
             trigger="click"
             placement="bottomRight"
             // 卡片内容
             content={<Fields />}>
             <SettingOutlined />
           </Popover>
           {/* 表格全屏控制 */}
           <FullscreenOutlined onClick={handleFullscreen} />
         </Space>
       </div>
     </div>
   )
 }
 
 function TableCard(props) {
   // 定义一个 ref，用于表格的全屏控制
   const rootRef = useRef();
   // Footer 组件中使用
   const batchActions = props.batchActions || [];
   // Footer 组件中使用
   const selected = props.selected || [];
   // 记录要展示的列
   // 例如全选则是 [0, 1, 2, 3 ...]，空数组表示不展示任何列
   const [fields, setFields] = useState([]);
   const [defaultFields, setDefaultFields] = useState([]);
   // 用于保存传入的表格的列数据
   const [columns, setColumns] = useState([]);
 
   useEffect(() => {
     // _columns - 传入的列数据 
     let [_columns, _fields] = [props.columns, []];
     if (props.children) {
       if (Array.isArray(props.children)) {
         _columns = props.children.filter(x => x.props).map(x => x.props)
       } else {
         _columns = [props.children.props]
       }
     }
     // 隐藏字段。有 hide 属性的是要隐藏的字段。如果有 tKey 字段，隐藏字段则以缓存的为准
     let hideFields = _columns.filter(x => x.hide).map(x => x.title)
     // tKey 是表格标识，比如这个表要隐藏 `状态` 字段，另一个表格要隐藏 `地址` 字段，与表格初始列展示对应。
     // 如果表格有唯一标识（tKey），再看TableFields（来自localStorage）中是否有数据，如果没有则更新缓存
     if (props.tKey) {
       if (TableFields[props.tKey]) {
         hideFields = TableFields[props.tKey]
       } else {
         TableFields[props.tKey] = hideFields
         localStorage.setItem('TableFields', JSON.stringify(TableFields))
       }
     }
 
     // Array.prototype.entries() 方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对。
     for (let [index, item] of _columns.entries()) {
       // 比如之前将 `状态` 这列隐藏，输出：hideFields ['状态']
       // console.log('hideFields', hideFields)
       if (!hideFields.includes(item.title)) _fields.push(index)
     }
     // 
     setFields(_fields);
     // 将传入的列数据保存在 state 中
     setColumns(_columns);
 
     // 记录初始展示的列
     setDefaultFields(_fields);
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
 
   // 列展示的操作。
   function handleFieldsChange(fields) {
     // 更新选中的 fields
     setFields(fields)
     // tKey 就是一个标识，可以将未选中的fields存入 localStorage。比如用户取消了 `状态` 这列的展示，只要没有清空缓存，下次查看表格中仍旧不会显示`状态`这列
     // 将列展示状态保存到缓存
     if (props.tKey) {
       TableFields[props.tKey] = columns.filter((_, index) => !fields.includes(index)).map(x => x.title)
       localStorage.setItem('TableFields', JSON.stringify(TableFields))
       // 隐藏三列（"频率","描述","操作"），输入： {"hi":["备注信息"],"cb":[],"cg":[],"cc":[],"sa":[],"mi":["频率","描述","操作"]}
       // console.log(localStorage.getItem('TableFields'))
     }
   }
 
   // 分为三部分：Header、Table和 Footer。
   return (
     <div ref={rootRef} className={styles.tableCard}>
       {/* 头部。 */}
       <Header
         // 表格标题。例如`角色列表`
         title={props.title}
         // 表格的列
         columns={columns}
         // 操作。例如新增、批量删除等操作
         actions={props.actions}
         // 不隐藏的列
         fields={fields}
         rootRef={rootRef}
         defaultFields={defaultFields}
         // 所选列变化时触发
         onFieldsChange={handleFieldsChange}
         onReload={props.onReload} />
       {/* antd 的 Table 组件 */}
       <Table
         // 表格元素的 table-layout 属性，例如可以实现`固定表头/列`
         tableLayout={props.tableLayout}
         // 表格是否可滚动
         scroll={props.scroll}
         // 表格行 key 的取值，可以是字符串或一个函数。spug 中 `rowKey="id"` 重现出现在 29 个文件中。
         rowKey={props.rowKey}
         // 加载中的 loading 效果
         loading={props.loading}
         // 表格的列。用户可以选择哪些列不显示
         columns={columns.filter((_, index) => fields.includes(index))}
         // 数据源
         dataSource={props.dataSource}
         // 表格行是否可选择，配置项（object）。可以不传
         rowSelection={props.rowSelection}
         // 展开功能的配置。可以不传
         expandable={props.expandable}
         // 表格大小 default | middle | small
         size={props.size}
         // 分页、排序、筛选变化时触发
         onChange={props.onChange}
         // 分页器，参考配置项或 pagination 文档，设为 false 时不展示和进行分页
         pagination={props.pagination} />
       {/* selected 来自 props，在 Footer 组件中显示选中了多少项等信息，spug 中没有使用到 */}
       {selected.length ? <Footer selected={selected} actions={batchActions} /> : null}
     </div>
   )
 }
 
 // spug 没有用到，我们也删除
//  TableCard.Search = Search;
 export default TableCard