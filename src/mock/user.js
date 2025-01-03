import Mock from "mockjs";

Mock.mock(/\/api\/user\/(\d+)\/info/, 'get', (options) => {
    console.log(options.url)
    const id = options.url.match(/\/api\/user\/(\d+)\/info/)[1]
    if (id == 1) {
        return {
            err: null,
            data: {
                "id": id,
                "username": "KLmon",
                "avatar": "base64",
                "profile": "这个人很懒",
                "subscribers_count": 70,
                "subscribing_count": 45,
                "is_subscribe": false
            }
        }
    }
    else if (id == 2)
        return {
            err: null,
            data: {
                "id": id,
                "username": "G3rY",
                "avatar": "base64",
                "profile": "这个人很勤快很勤快很勤快很勤快很勤快很勤快很勤快很勤快很勤快",
                "subscribers_count": 23,
                "subscribing_count": 33,
                "is_subscribe": true
            }
        }
    else
        return {
            err: null,
            data: {
                "id": id,
                "username": "Chitanda",
                "avatar": "base64",
                "profile": "这个人很勤快",
                "subscribers_count": 666666,
                "subscribing_count": 888888,
                "is_subscribe": true
            }
        }
})

Mock.mock(/\/api\/user\/subscribe\//, 'post', (options) => {
    console.log(options.body)
    return {
        err: null,
        data: 'success'
    }
})
