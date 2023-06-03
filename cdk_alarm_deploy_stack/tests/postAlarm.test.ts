
import {handler} from '../alarms/handler';
import { IAlarm } from '../alarms/util';

const e:any = {};
e.httpMethod='POST',
e.body=JSON.stringify({
  arrival_time: "15:49:45", 
  arrival_date: "01-06-2023", 
  type: 2, 
  name: "now stationary", 
  coords: {"x1": 0.3234567901234568, "y1": 0.18611111111111112, "x2": 1.5604938271604938, "y2": 0.49444444444444446}, 
  object_id: "123",
  camera_name: "camera2", 
  last_update_time: "15:49:47", 
  last_update_date: "01-06-2023"
} as IAlarm);

const c:any = {};

handler(e, c);