import Mock from 'mockjs'

// 模拟获取一级评论
Mock.mock(/\/api\/post\/(\d+)\/comments\/(?=\?)/, 'get', (options) => {
    // console.log(options.url)
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
Mock.mock(/\/api\/post\/comment\/good\//, 'post', () => {
    return {
        err: null,
        data: 'success'
    }
})

// 模拟二级评论
Mock.mock(/\/api\/post\/(\d+)\/comments\/(\d+)\//, 'get', ()=> {
  // console.log(options.url)
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
              "reply_to_id": 81,
              "reply_to_name": "哀诚"
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
Mock.mock(/\/api\/post\/comment\/new\//, 'post', ()=>{
    return {
        err: null,
        data: 'success'
    }
})
