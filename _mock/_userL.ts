import { MockRequest } from '@delon/mock';

const list: any[] = [];
const total = 50;
const random = (i: number) => {
  return (Math.floor((Math.random()) * 10) % i);
}

for (let i = 0; i < total; i += 1) {
  list.push({
    id: i + 1,
    balance: Math.ceil(Math.random() * 10 * (i + 1)),
    coins: Math.ceil(Math.random() * 10 * (i + 1)),
    fans: Math.ceil(Math.random() * 10 * (i + 1)),
    integral: Math.ceil(Math.random() * 10 * (i + 1)),
    createtime: '1234567890123',
    updatetime: '1234567890123',
    nickname: 'lt-' + i,
    phone: '123-' + i,
    register: random(4),
    role: random(2),
    source: random(4),
    status: random(5),
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
  });
}

function getRule(params: any) {
  let ret = [...list];
  if (params.sorter) {
    const s = params.sorter.split('_');
    ret = ret.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  console.log(params);
  // console.log(params.statusList);
  // console.log(params.statusList.length);
  console.log(params.statusList && params.statusList.length > 0);

  console.log(ret.length);
  if (params.statusList && params.statusList.length > 0) {
    console.log("filter");

    ret = ret.filter(data => {
      return params.statusList.indexOf(data.status) > -1;
    });
  }

  console.log(ret.length);

  // if (params.no) {
  //   ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  // }
  return ret;
}

export const USERLS = {
  'GET /lt/user/list': (req: MockRequest) => getRule(req.queryString),
};
