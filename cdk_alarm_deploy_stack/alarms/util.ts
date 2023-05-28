import {APIGatewayProxyResult} from 'aws-lambda';
import {randomUUID } from "crypto"

export const ApigateWayProxyResult = (statusCode:number, msg:string):APIGatewayProxyResult =>{
  return {
    statusCode,
    body:JSON.stringify({
      message:msg
    })
  }
}

export interface IAlarm {
  type:number;
  name:string;
  id:string;
}

export const enum http {
  POST='POST',
  GET='GET'
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