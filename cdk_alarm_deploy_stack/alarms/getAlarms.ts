import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ApigateWayProxyResult } from "./util";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const alarmTable = 'alaramuitable'

export const getAlarms = async (event: APIGatewayProxyEvent, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> => {

  try{
    const result = await dbClient.send(new ScanCommand({
      TableName:alarmTable
    }))

    console.log(result.Items);
    return {
      statusCode:200,
      body:JSON.stringify(result.Items)
    };

  }catch(error:any){
    console.log(error.message)
    return ApigateWayProxyResult(501, error.message)
  }
}