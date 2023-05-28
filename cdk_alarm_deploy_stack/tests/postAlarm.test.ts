import {handler} from '../alarms/handler';

const e:any = {};
e.httpMethod='POST',
e.body=JSON.stringify({
  type:1,
  name:'intruder male'
});

const c:any = {};

handler(e, c);