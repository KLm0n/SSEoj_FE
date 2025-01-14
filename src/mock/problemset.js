import Mock from 'mockjs'

// 获取题库
Mock.mock(/\/api\/problemset\/(?!\w)/, 'get', (options) => {

    const query = options.url.split('?')[1];
    const params = new URLSearchParams(query);
    const page = params.get('page_num');
    const page_size = params.get('page_size');
    if (page == 1) {
        return {
            err: null,
            data: {
                count: 100,
                problems: [
                    {
                        "status": true,
                        "id": 1001,
                        "name": "你好，世界",
                        "tags": [
                            1,
                            2,
                            3
                        ],
                        "pass_count": 550,
                        "attempt_count": 1000,
                        "difficulty": 5
                    },
                    {
                        "status": false,
                        "id": 1001,
                        "name": "你好，世界",
                        "tags": [
                            1,
                            2,
                            3
                        ],
                        "pass_count": 550,
                        "attempt_count": 1000,
                        "difficulty": 5
                    },
                    {
                        "status": true,
                        "id": 1001,
                        "name": "你好，世界",
                        "tags": [
                            1,
                            2,
                            3
                        ],
                        "pass_count": 550,
                        "attempt_count": 1000,
                        "difficulty": 5
                    },
                    {
                        "status": false,
                        "id": 1001,
                        "name": "你好，世界",
                        "tags": [
                            1,
                            2,
                            3
                        ],
                        "pass_count": 550,
                        "attempt_count": 1000,
                        "difficulty": 5
                    }
                ]
            }
        }
    }
    else if (page == 2) {
        return {
            err: null,
            data: {
                count: 100,
                problems: [{
                    "status": true,
                    "id": 1002,
                    "name": "A+B",
                    "tags": [
                        3,
                        4
                    ],
                    "pass_count": 666,
                    "attempt_count": 1000,
                    "difficulty": 3
                },
                ]
            }
        }
    }
}
)

// 提交题解
Mock.mock(/\/api\/solution\/create\//, 'post', () => {
    return {
        err: null,
        data: 'success'
    }
})

// 模拟获取详细题解
Mock.mock(/\/api\/problem\/(\d+)\/solutions\/(\d+)\//, 'get', () => {
    const data = {
        "user_info": {
            "id": 84,
            "username": "鲍梓妍",
            "avatar": "https://avatars.githubusercontent.com/u/37607428"
        },
        "like_count": 76,
        "comment_count": 20,
        "create_time": "2024-12-21 05:04:12",
        "tags": [
            22
        ],
        "id": 38,
        "title": "血淋淋成年人关于搜呼遍及尽管同样地",
        "content": "adipisicing nulla do Lorem",
        "is_like": true
    }
    return {
        err: null,
        data: data
    }
})

// 模拟获取一级评论
Mock.mock(/\/api\/problem\/solutions\/(\d+)\/comments\/(?=\?)/, 'get', () => {
    const data = {
        "count": 100,
        "comments": [
            {
                "id": 34,
                "user_info": {
                    "id": 81,
                    "username": "秦敬阳",
                    "avatar": "https://avatars.githubusercontent.com/u/86763916"
                },
                "is_good": false,
                "content": "Duis tempor sint",
                "like_count": 94,
                "create_time": "2024-04-05 14:43:28",
                "comments_count": 0
            },
            {
                "id": 35,
                "user_info": {
                    "id": 34,
                    "username": "仆明",
                    "avatar": "https://avatars.githubusercontent.com/u/74314786"
                },
                "is_good": false,
                "content": "dolor",
                "like_count": 20,
                "create_time": "2025-10-24 20:04:30",
                "comments_count": 52
            },
            {
                "id": 18,
                "user_info": {
                    "id": 68,
                    "username": "首伟",
                    "avatar": "https://avatars.githubusercontent.com/u/67513096"
                },
                "is_good": true,
                "content": "Excepteur irure Lorem sed eu",
                "like_count": 1,
                "create_time": "2025-10-14 06:32:20",
                "comments_count": 84
            }
        ]
    }
    return {
        err: null,
        data: data
    }
})

// 模拟点赞题解评论
Mock.mock(/\/api\/solution\/comment\/good\//, 'post', () => {
    return {
        err: null,
        data: 'success'
    }
})

// 模拟二级评论
Mock.mock(/\/api\/problem\/solutions\/(\d+)\/comments\/(\d+)\//, 'get', ()=> {
    const data = {
        "count": 20,
        "comments": [
            {
                "id": 26,
                "user_info": {
                    "id": 44,
                    "username": "耿勇",
                    "avatar": "https://avatars.githubusercontent.com/u/91847636"
                },
                "is_good": false,
                "content": "nostrud occaecat consectetur",
                "create_time": "2024-08-12 09:39:48",
                "like_count": 100,
                "reply_to_id": null,
                "reply_to_name":null
            },
            {
                "id": 97,
                "user_info": {
                    "id": 42,
                    "username": "幸欣怡",
                    "avatar": "https://avatars.githubusercontent.com/u/63754484"
                },
                "is_good": false,
                "content": "proident aliqua minim eiusmod non",
                "create_time": "2025-04-10 01:42:05",
                "like_count": 66,
                "reply_to_id": 97,
                "reply_to_name": "厍榕融"
            }
        ]
    }
    return {
        err: null,
        data: data
    }
})

// 模拟发布评论
Mock.mock(/\/api\/problem\/solutions\/comment\/new\//, 'post', ()=>{
    return {
        err: null,
        data: 'success'
    }
})

// 模拟发布题目
Mock.mock(/\/api\/problem\/create\//, 'post', () => {
    return {
        err: null,
        data: 'success'
    }
})

// 模拟获取所有题目数量
Mock.mock(/\/api\/problemset\/problem_num\//, 'get', () => {
    return {
        err: null,
        data: [1,3,2,5,4,6]
    }
})