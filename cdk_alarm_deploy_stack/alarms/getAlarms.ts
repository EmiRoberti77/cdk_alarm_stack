import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ApigateWayProxyResult } from "./util";
import { DynamoDBClient, ScanCommand, GetItemCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const alarmTable = 'alaramuitable';
const enum queryStrings {
  datetime = 'datetime',
  type = 'type',
  name = 'name',
  id = 'id'
}

export const getAlarms = async (event: APIGatewayProxyEvent, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> => {

  if(event.queryStringParameters){
    //if it has date query by date
    if(queryStrings.datetime in event.queryStringParameters){ 
      const datetime = event.queryStringParameters[queryStrings.datetime]!
       return await getAlarmsByTime(datetime, dbClient)
    } 

    if(queryStrings.id in event.queryStringParameters){
      const uniqueId = event.queryStringParameters[queryStrings.id]!
      return await getAlarmByID(uniqueId, dbClient)
    }
  } else {
    return await scanAll(dbClient)
  }
  return ApigateWayProxyResult(501, 'emi error on all paths');
}

const getAlarmByID = async (uniqueID:string, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> =>{
  try{

    const result = await dbClient.send(new GetItemCommand({
      TableName:alarmTable,
      Key:{
        id: {S: uniqueID}
      }
    }));

    return{
      statusCode:200,
      body:JSON.stringify({
        message: unmarshall(result.Item!)
      })
    }
  } catch(error:any) {
    return ApigateWayProxyResult(501, error.message)
  }
}

const getAlarmsByTime =  async (datetime:string, dbClient:DynamoDBClient) => {

  try{
    const params = {
      TableName: alarmTable,
      FilterExpression: '#dt > :datetime',
      ExpressionAttributeNames: {
        '#dt': 'datetime',
      },
      ExpressionAttributeValues: {
        ':datetime': { S: datetime },
      },
    };

    const result = await dbClient.send(new ScanCommand(params));

    console.log(result.Items);

    return{
      statusCode:200,
      body:JSON.stringify(result.Items?.map((item)=>{
        return unmarshall(item)
      }))
    }
  } catch(error:any) {
    return ApigateWayProxyResult(501, error.message)
  }
}

const scanAll = async (dbClient: DynamoDBClient):Promise<APIGatewayProxyResult> =>{

  try{
    const result = await dbClient.send(new ScanCommand({
      TableName:alarmTable
    }))

    console.log(result.Items);
    return {
      statusCode:200,
      body:JSON.stringify(result.Items?.map((item)=>{
        return unmarshall(item)
      }))
    };

  }catch(error:any){
    console.log(error.message)
    return ApigateWayProxyResult(501, error.message)
  }
}

export const getAlarmByObject_Id = async (
                                          objectID:string, 
                                          dbClient:DynamoDBClient
                                          ):Promise<APIGatewayProxyResult | ScanCommandOutput> => {

  try {

      console.log('object_id',objectID)
      return await dbClient.send(new ScanCommand({
      TableName: alarmTable,
      FilterExpression: 'object_id = :objectID',
      ExpressionAttributeValues: {
        ':objectID': { S: objectID },
      },
    }))

  }catch(error:any){
    console.log(error.message)
    return ApigateWayProxyResult(501, error.message)
  }
}