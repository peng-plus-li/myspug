
// myspug\src\libs\index.js
import _http from './http';
import _history from './history';

// 导出一切。注：没有导出默认值
export * from './functools';

export const http = _http;
export const history = _history;
export const VERSION = 'v1.0.0';
