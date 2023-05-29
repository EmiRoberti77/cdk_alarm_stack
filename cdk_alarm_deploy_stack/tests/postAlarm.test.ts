
import {handler} from '../alarms/handler';
import { IAlarm } from '../alarms/util';

const e:any = {};
e.httpMethod='POST',
e.body=JSON.stringify({
  type:2,
  name:'train leave',
  objectid:'345678',
  x:0.57657,
  y:0.78989,
  h:10,
  w:20,
  confidence:0.89,
  date:'2022-09-09 11:56',
} as IAlarm);

const c:any = {};

handler(e, c);