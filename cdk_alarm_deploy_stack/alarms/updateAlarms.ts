import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {ApigateWayProxyResult, IAlarm, createId, isIAlarmValid} from './util';
import {DynamoDBClient, UpdateItemCommand} from '@aws-sdk/client-dynamodb';
import { marshall } from "@aws-sdk/util-dynamodb";

const alarmTable = 'alaramuitable'
export const updateAlarms = async (item:IAlarm, dbClient: DynamoDBClient):Promise<APIGatewayProxyResult> => {

  console.log(item);

  try{
    console.log(`tablename update -> ${alarmTable}`)
    
    // Specify the table name and key attributes
    const key = { id: { S: item.id } }; // Example assuming a string key "id"
    
    // Specify the updates to be made
    const updates = {
      ":newAttribute1": { N: item.type.toString()},
      ":newAttribute2": { S: item.name },
      ":newAttribute3": { S: item.last_update_date },
      ":newAttribute4": { S: item.last_update_time }
    };
    
    // Construct the UpdateItemCommand
    const updateCommand = new UpdateItemCommand({
      TableName: alarmTable,
      Key: key,
      UpdateExpression: "SET #attrType = :newAttribute1, #attrName = :newAttribute2, last_update_date= :newAttribute3, last_update_time= :newAttribute4",
      ExpressionAttributeValues: updates,
      ExpressionAttributeNames: { 
        "#attrName": "name",
        "#attrType":"type"
       },
      ReturnValues: "ALL_NEW", // Specify the desired return values if needed
    });
    
    console.log("______________");
    console.log(JSON.stringify(updateCommand));
    // Execute the command
    try {
      const result = await dbClient.send(updateCommand);
      console.log("Item updated successfully:", result);

      return{
        statusCode:201,
        body:JSON.stringify({
          message:item.id
        })
      }
    } catch (error:any) {
      console.error("Error updating item:", error);
      return ApigateWayProxyResult(501, error.message);
    }

  } catch(error:any){
    console.error("Error:", error);
    return ApigateWayProxyResult(501, error.message);
  }
} 