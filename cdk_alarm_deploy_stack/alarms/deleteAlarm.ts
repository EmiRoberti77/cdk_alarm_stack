import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ApigateWayProxyResult, TABLES } from "./util";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const ID = 'id';

export const deleteAlarm = async (event:APIGatewayProxyEvent, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> => {

  if(!event.queryStringParameters)
    return ApigateWayProxyResult(400, 'Error - Missing id param')

  const id = event.queryStringParameters[ID];

  try{
    const result = dbClient.send(new DeleteItemCommand({
      TableName:TABLES.alarmTable,
      Key:{
        ID: {
          S: id!
        }
      }
    }));

    return ApigateWayProxyResult(200, id)

  } catch (err:any) {
    console.log(err)
    return ApigateWayProxyResult(501, err.message);
  }
}