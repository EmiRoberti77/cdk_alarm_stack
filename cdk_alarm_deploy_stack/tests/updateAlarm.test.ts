import {handler} from '../alarms/handler';
import { IAlarm } from '../alarms/util';

const e:any = {};
e.httpMethod='PUT',
e.body=JSON.stringify({
  type:2,
  name:'train leave',
  objectid:'345678',
  x:0.57657,
  y:0.78989,
  h:10,
  w:20,
  confidence:12,
  date:'2022-09-09 11:56',
  id:"ae830160-9032-4d86-a67a-b7852c67fd21"
} as IAlarm);

const c:any = {};

handler(e, c);