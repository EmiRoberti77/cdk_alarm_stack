import { StringListParameter } from 'aws-cdk-lib/aws-ssm';
import {APIGatewayProxyResult, AttributeValue} from 'aws-lambda';
import {randomUUID } from "crypto"
import { parseArgs } from 'util';

export const ApigateWayProxyResult = (statusCode:number, 
                                      msg:string ): APIGatewayProxyResult =>{
  return {
    statusCode,
    body:JSON.stringify({
      message:msg
    })
  }
}

export interface IAlarm {
  id:string;
  type:number;
  name:string;
  objectid:string;
  date:string;
  x:number;
  y:number;
  h:number;
  w:number;
  confidence:number;
  datetime:string;
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
  PUT='PUT'
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