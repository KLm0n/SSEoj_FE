import Mock from 'mockjs'

Mock.mock(/\/api\/post\/(\d+)\/information/, 'get', (options) => {
    const id = options.url.match(/\/api\/post\/(\d+)\/information/)[1];

    const data = {
      "id":id,
      "post_title": "考虑到在呼呼呼统统挥捏伟大带宽从D",
      "like_count": 25,
      "comment_count": 87,
      "post_content": "dolore ut labore aute mollit AJDKADJKLADK\n\n\n\n\nLADKLSKAdadaad阿大大大大大苏打大苏打大苏打撒大大撒旦水水水水水水水水事实上水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水zssdsddddd\n dddd",
      "create_time": "2024-04-05",
      "name": "安语桐",
      "avator": "adipisicing ullamco ut id eu",
      "is_good": false,
    };
    return {
      err: null,
      data: data
    };
});
