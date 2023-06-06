import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {ApigateWayProxyResult, IAlarm, TABLES, createId, isIAlarmValid} from './util';
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getAlarmByObject_Id } from './getAlarms';
import { ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { updateAlarms } from './updateAlarms';

export const postAlarm = async (event:APIGatewayProxyEvent, dbClient: DynamoDBClient):Promise<APIGatewayProxyResult> => {

  //create body
  const item:IAlarm = JSON.parse(event.body!) as IAlarm;
  //check if alarm exists
  const result = await getAlarmByObject_Id(item.object_id, dbClient);

  if( typeof result === 'object' && 'Items' && 'Count' in result){
    console.log('dynamoDBItem_returned')
    
    if(result.Count! > 0){
      console.log('in update')
      console.log(JSON.stringify(result));


      const unmarshelledArrary = result.Items?.map( item => {
        return unmarshall(item);
      })

      if(unmarshelledArrary && unmarshelledArrary.length > 0){
        item.id = ( unmarshelledArrary[0] as IAlarm).id
        return await updateAlarms(item, dbClient)
      }
      
    } else { //if exists update - insert
      item.id = createId();
      item.datetime = new Date().toISOString(); 
      console.log('in post')
      return await postNew(item, dbClient);
    }
  }
  return ApigateWayProxyResult(501, 'getAlarmByObject_Id did not return a valid Item');

} 

const postNew = async (item:IAlarm, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> => {
  try{
    console.log(`tablename in postNew-> ${TABLES.alarmTable}`)
    console.log(`table name from process.env.ALARM_TABLE=${process.env.ALARM_TABLE}`);

    if(isIAlarmValid(item)){
      console.log(item)
      const result = await dbClient.send(new PutItemCommand({
        TableName:TABLES.alarmTable,
        Item:marshall(item, {convertClassInstanceToMap:true})
      }))

      console.log(result);

      return {
        statusCode:201,
        body:JSON.stringify({
          message:item.id
        }) 
      }
    };
  } catch(error:any) {
    console.log(error)
    return ApigateWayProxyResult(501, error.message);
  } 
  return ApigateWayProxyResult(501, "no action taken in POST => postAlarm");
}