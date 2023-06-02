import {handler} from '../getalarms/handler';

const e:any = {};
e.httpMethod='GET'
e.queryStringParameters={
  object_id:'11'
}

const c:any = {};

handler(e, c);