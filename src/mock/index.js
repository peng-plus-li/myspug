import Mock from 'mockjs'

// 开发环境引入 mock
if (process.env.NODE_ENV === 'development') {
    Mock.mock('/api/account/login/', 'post', 
    
    // {
    //     "data": { "id": 1, "access_token": "5bb076db06fd4001b85d12e44ab96c56", "nickname": "\u7ba1\u7406\u5458", "is_supper": true, "has_real_ip": true, "permissions": [] }, "error": ""
    // }

    {"data": {"id": 2, "access_token": "74b0fe67d09646ee9ca44fc48c6b457a", "nickname": "pjl", "is_supper": !false, "has_real_ip": true, "permissions": ["system.role.view", "alarm.alarm.view"]}, "error": ""}

    
    
    )
    // Mock.mock(/\/api\/account\/role\/.*/, 'get', { "data": [{ "id": 1, "name": "1", "desc": null, "page_perms": {}, "deploy_perms": {}, "group_perms": [], "created_at": "2023-02-06 13:53:02", "created_by_id": 1, "used": 0 }], "error": "" })

    const getNum = () => String(+new Date()).slice(-3)
    // 注：第三个参数必须不能是对象，否则 getNum 不会重新执行
    Mock.mock(/\/api\/account\/role\/.*/, 'get', function () {
        return {
            "data": {
                data: new Array(10).fill(0).map((item, index) => ({
                    "id": index + getNum(), "name": 'name' + index + getNum(), "desc": null,
                })),
                total: 10000,
            }
            , "error": ""
        }
    })

    
}