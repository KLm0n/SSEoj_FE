import Mock from 'mockjs';

// 模拟登录接口
Mock.mock('http://localhost:8080/api/identity/login/', 'post', (options) => {
  const body = JSON.parse(options.body);
  console.log(body);
  if (body.email === 'admin' && body.password === '123456') {
    return {
      err: null,
      data: {
        id: 1,
        username: 'Chitanda'
      }
    };
  } else {
    return {
      err: 'wrong password',
      msg: '用户名或密码错误'
    };
  }
});
