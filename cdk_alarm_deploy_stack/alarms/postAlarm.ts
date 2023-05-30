import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {ApigateWayProxyResult, IAlarm, createId, isIAlarmValid} from './util';
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import { marshall } from "@aws-sdk/util-dynamodb";

const alarmTable = 'alaramuitable'
export const postAlarm = async (event:APIGatewayProxyEvent, dbClient: DynamoDBClient):Promise<APIGatewayProxyResult> => {

  //create body
  const item:IAlarm = JSON.parse(event.body!) as IAlarm;
  item.id = createId();
  item.datetime = new Date().toISOString();

  console.log(item);

  try{
    console.log(`tablename -> ${alarmTable}`)
    console.log(`table name from process.env.ALARM_TABLE=${process.env.ALARM_TABLE}`);

    if(isIAlarmValid(item)){
      const result = await dbClient.send(new PutItemCommand({
        TableName:alarmTable,
        Item:marshall(item, {convertClassInstanceToMap:true})
      }))

      console.log(result);
    }
  } catch(error:any) {
    console.log(error)
    return ApigateWayProxyResult(501, error.message);
  } 
  
  return ApigateWayProxyResult(201, `added succesfully id=${item.id}`);
} 