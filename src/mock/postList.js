import Mock from 'mockjs'

Mock.mock(/\/api\/post\/list(\?.*)?/, 'get', (options) => {
    console.log("Mock Intercepted Request:", options.url);

    const query = options.url.split('?')[1];
    const params = new URLSearchParams(query);
    const page = params.get('page_num');
    const page_size = params.get('page_size');
    const keyword = params.get('keyword');

    if (page == 1 && keyword==='') {
        return {
            err: null,
            data: {
                count: 100,
                post_list: [
                  {
                      "post_id": 1,
                      "post_title": "当小划拨全部",
                      "user_id": 66,
                      "username": "焦敬彪",
                      "avatar": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/0u1lToAAAAASUVORK5CYII=",
                      "like_count": 9,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/12/17"
                  },
                  {
                    "post_id": 3,
                      "post_title": "aiaiai",
                      "user_id": 66,
                      "username": "神人",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 2,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/12/18"
                  },
                  {
                    "post_id": 4,
                      "post_title": "aiaiai",
                      "user_id": 66,
                      "username": "神人",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 100,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/12/22"
                  },
                  {
                    "post_id": 5,
                      "post_title": "aiaiai",
                      "user_id": 66,
                      "username": "aaaaaaaaaa",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 33,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/12/7"
                  },
                  {
                    "post_id": 6,
                      "post_title": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                      "user_id": 66,
                      "username": "神人",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 91,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/12/1"
                  },
                  {
                    "post_id": 7,
                      "post_title": "aiaiai",
                      "user_id": 66,
                      "username": "神人",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 9,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/2/17"
                  },
                  {
                    "post_id": 8,
                      "post_title": "aiaiai",
                      "user_id": 66,
                      "username": "神人",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 9,
                      "comment_count": 10,
                      "is_good": false,
                      "create_time":"2024/1/17"
                  },
                  {
                    "post_id": 8,
                      "post_title": "aiaiai",
                      "user_id": 1,
                      "username": "KLmon",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 1,
                      "comment_count": 10,
                      "is_good": false
                  },

                  // {
                  //   "post_id": 8,
                  //     "post_title": "aiaiai",
                  //     "user_id": 1,
                  //     "username": "KLmon",
                  //     "avatar": "https://avatars.githubusercontent.com/u/17516427",
                  //     "like_count": 1,
                  //     "comment_count": 10,
                  //     "is_good": false
                  // }
              ]
            }
        }
    }
    else if (page == 2 && keyword == '') {
        return {
            err: null,
            data: {
                count: 100,
                post_list: [
                  {
                      "post_id": 2,
                      "post_title": "差点儿影响力也不敢情箱子捧",
                      "user_id": 88,
                      "username": "泥沐宸",
                      "avatar": "https://avatars.githubusercontent.com/u/83853740",
                      "like_count": 59,
                      "comment_count": 32,
                      "is_good": true,
                      "create_time":"2024/5/17"
                  },
                  {
                    "post_id": 9,
                      "post_title": "aiaiai",
                      "user_id": 1,
                      "username": "KLmon",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 1,
                      "comment_count": 10,
                      "is_good": false
                  },
                  {
                    "post_id": 10,
                      "post_title": "aiaiai",
                      "user_id": 1,
                      "username": "KLmon",
                      "avatar": "https://avatars.githubusercontent.com/u/17516427",
                      "like_count": 1,
                      "comment_count": 10,
                      "is_good": false
                  },
              ]
            }
        }
    }

    else if (page == 2&& keyword == "1") {
      return {
          err: null,
          data: {
              count: 100,
              post_list: [
                {
                    "post_id": 2,
                    "post_title": "差点儿影响力也不敢情箱子捧",
                    "user_id": 88,
                    "username": "泥沐宸",
                    "avatar": "https://avatars.githubusercontent.com/u/83853740",
                    "like_count": 59,
                    "comment_count": 32,
                    "is_good": true,
                    "create_time":"2024/5/17"
                }
            ]
          }
      }
  }

  else {
    return{
      err:null,
      data:{
        count:0,
        post_list:[]
      }
    }
  }
}
)
