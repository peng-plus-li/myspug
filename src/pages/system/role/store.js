// myspug\src\pages\system\role\store.js

import { observable, computed, action } from 'mobx';
import http from '@/libs/http';

class Store {
  @observable formVisible = false;

  @observable record = {};

  @observable f_name;

  @observable records = [];

  // 默认第1页
  @observable current = 1;

  // 总共多少页
  @observable total = '';

  // 其他参数，例如排序、过滤等等
  @observable tableOptions = {}

  @observable isFetching = false;

  @computed get dataSource() {
    let records = this.records;
    return records
  }

  _getTableParams = () => ({ current: this.current, ...this.tableOptions })

  @action setCurrent(val) {
    this.current = val
  }


  // 整个项目之前都没有接收参数，难道是因为 onload 时会传参数过来
  // 类似下面这种写法会报错：
  // http.get('/api/cicd/gitlab/gitlab/', {params: realParams})
  // : Converting circular structure to JSON --> starting at object with constructor 'FiberNode' | property 'stateNode' -> object with constructor 'SVGSVGElement' --- property '__reactInternalInstance$d6c3cfqahz' closes the circle
  fetchRecords = () => {
    const realParams = this._getTableParams()

    // 过滤参数

    if (this.f_name) {
      realParams.role_name = this.f_name
    }
    this.isFetching = true;
    console.log('realParams', realParams)
    http.get('/api/account/role/', { params: realParams })
      .then(res => {
        // 可以这么赋值
        // ({data: this.records, total: this.pagination.total} = res)
        this.total = res.total
        this.records = res.data
      })
      .finally(() => this.isFetching = false)
  }

  // 显示新增弹框
  // info 或许是为了编辑
  showForm = (info = {}) => {
    this.formVisible = true;
    this.record = info
  };
}

export default new Store()