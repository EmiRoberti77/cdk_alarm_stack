import { StringListParameter } from 'aws-cdk-lib/aws-ssm';
import {APIGatewayProxyResult, AttributeValue} from 'aws-lambda';
import {randomUUID } from "crypto"
import { parseArgs } from 'util';

const DEFAULT_MSG = 'code not complete'

export enum TABLES {
  alarmTable = 'alaramuitable'
}

export const ApigateWayProxyResult = (statusCode:number = 501, 
                                      msg:string = DEFAULT_MSG ): 
                                      APIGatewayProxyResult =>{
  return {
    statusCode,
    body:JSON.stringify({
      message:msg
    })
  }
}

export interface Coords {
  y1:number;
  x1:number;
  y2:number;
  x2:number;
}
export interface IAlarm {
  id:string;
  type:number;
  name:string;
  object_id:string;
  datetime:string;
  camera_name:string;
  last_update_time:string;
  arrival_time:string;
  arrival_date:string;
  last_update_date:string;
  coords:Coords;
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if(!arg.headers) {
      arg.headers = {}
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
}

export const enum http {
  POST='POST',
  GET='GET',
  PUT='PUT',
  DELETE='DELETE'
}

export const createId = ():string => {
  return randomUUID();
}

export const isIAlarmValid = (a:IAlarm):boolean =>{
 if(!a.id){
   console.log('id missing from alarm object')
   return false;
 }

  if(!a.name){
    console.log('name missing from alarm object')
    return false; 
  }

  if(!a.type){
    console.log('type missing from alarm object')
    return false; 
  }

  return true;
}