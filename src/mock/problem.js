import Mock from "mockjs";

// 模拟获取题目描述
Mock.mock(/\/api\/problem\/(\d+)\/description/, 'get', function (options) {
  const id = options.url.match(/\/api\/problem\/(\d+)\/description/)[1];
  // 根据id生成模拟数据
  const data = {
    "id": id,
    "name": "昔国秀",
    "description": "除民强与切事史划易。经需问九又各行。家反我带生全。严此林很特格增求。即细市世则层。业角专观细实展。着委林。",
    "input_style": "veniam",
    "output_style": "in",
    "data_range": "nostrud in nulla tempor",
    "difficulty": 5,
    "time_limit": 1000,
    "memory_limit": 32768,
    "sample": {
      "inputs": [
        "Duis nulla est incididunt enim anim minim cupidatat enim anim minim cupidatat enim anim minim cupidatat enim anim minim cupidatat",
        "Duis nulla est incididunt"
      ],
      "outputs": [
        "Excepte\nenim anim minim cupidatat",
        "laborum nisi ullamco dolore reprehenderit"
      ]
    },
    "tags": [
      1,
      2,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    "source": "est",
    "star_count": 233,
    "similar_problems": [
      {
        "check_status": true,
        "id": "koowIYvklt6eUTM5YPrSO",
        "name": "锺桂兰",
        "difficulty": "irure"
      }
    ],
    "pass_status": true,
    "star_status": true,
    "pass_count": 5,
    "attempt_count": 100
  };
  return {
    err: null,
    data: data
  };
});

// 模拟获取题解列表
Mock.mock(/\/api\/problem\/(\d+)\/solutions/, 'get', (options) => {
  console.log(options.url)
  const data = {
    "count": 25,
    "taglist": [
      22,
      96,
      31
    ],
    "solutions": [
      {
        "id": 33,
        "title": "酒吧每当到朝向",
        "content": "dolor Ut nostrud occaecat 的笔记撒不懂骚逼得逼哦达到巴萨就哦擦丝不从成本健身卡不错撒测",
        "user_info": {
          "id": 1,
          "username": "太叔梓涵",
          "avatar": "https://avatars.githubusercontent.com/u/2876268"
        },
        "like_count": 59,
        "comment_count": 10,
        "create_time": "2024-09-21 08:02:59",
        "tags": [
          1
        ],
        "is_good": false
      },
      {
        "id": 8,
        "title": "协议好呸鲁莽快切",
        "content": "amet enim",
        "user_info": {
          "id": 2,
          "username": "系中海",
          "avatar": "https://avatars.githubusercontent.com/u/44562488"
        },
        "like_count": 15,
        "comment_count": 12,
        "create_time": "2023-12-17 17:05:17",
        "tags": [
          28,
          2,
          13
        ],
        "is_good": true
      },
      {
        "id": 31,
        "title": "酒吧每当到朝向",
        "content": "dolor Ut nostrud occaecat",
        "user_info": {
          "id": 3,
          "username": "太叔梓涵",
          "avatar": "https://avatars.githubusercontent.com/u/2876268"
        },
        "like_count": 59,
        "comment_count": 10,
        "create_time": "2024-09-21 08:02:59",
        "tags": [
          1
        ],
        "is_good": false,
      },
      {
        "id": 81,
        "title": "协议好呸鲁莽快切",
        "content": "amet enim",
        "user_info": {
          "id": 4,
          "username": "系中海",
          "avatar": "https://avatars.githubusercontent.com/u/44562488"
        },
        "like_count": 15,
        "comment_count": 12,
        "create_time": "2023-12-17 17:05:17",
        "tags": [
          28,
          2,
          13
        ],
        "is_good": false,
      },
      {
        "id": 43,
        "title": "捡骨碌碌以免画互相 brr 尽管",
        "content": "consectetur Ut magna culpa",
        "user_info": {
          "id": 5,
          "username": "徭天娇",
          "avatar": "https://avatars.githubusercontent.com/u/10767048"
        },
        "like_count": 71,
        "comment_count": 66,
        "create_time": "2024-04-18 20:25:57",
        "tags": [
          48,
          3,
          25
        ],
        "is_good": true,
      }
    ]
  }

  return {
    err: null,
    data: data
  }
});

// 模拟点赞题解
Mock.mock(/\/api\/solution\/good/, 'post', (options) => {
  console.log('--mockjs:problem--')
  console.log(options.url)
  const body = JSON.parse(options.body);
  console.log(body)
  return {
    err: null,
    data: 'success'
  }
})

// 模拟获取提交列表
Mock.mock(/\/api\/problem\/(\d+)\/submissions\//, 'get', (options) => {
  const id = options.url.match(/\/api\/problem\/(\d+)\/submissions/)[1]
  console.log(options.url)
  const data = [
    {
      "submit_time": '2024-12-30 09:17:11.098980+00:00',
      "code": "cout << 'H\n\ne\nl\nl\no W\no\nr\nl\nd' << endl;'",
      "language": "C++",
      "result": 0,
      "error_info": null,
      "time_spent": 90,
      "memory_spent": 20
    },
    {
      "submit_time": '2025-01-03 09:17:11.098980+00:00',
      "code": "print('Hello World')\n   print('Hello World')",
      "language": "Python3",
      "result": -2,
      "error_info": "error_info",
      "time_spent": 3141,
      "memory_spent": 10299
    }
  ]
  return {
    err: null,
    data: data
  }
})

// 模拟提交题目
Mock.mock(/\/api\/problem\/submit\//, 'post', () => {
  return {
    err: null,
    data: 'success'
  }
})