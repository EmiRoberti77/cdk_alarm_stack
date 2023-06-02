import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ApigateWayProxyResult, addCorsHeader, http } from "../alarms/util";
import { getAlarms } from "../alarms/getAlarms";

const dbClient = new DynamoDBClient({});
const alarmTable = 'alaramuitable'
const OBJ_ID:string = 'object_id'

export const handler = async (event:APIGatewayProxyEvent, context:Context):Promise<APIGatewayProxyResult> => {

  const method = event.httpMethod;
  let response:APIGatewayProxyResult;
  let objectid:string = '';

  if(event.queryStringParameters){
    if(OBJ_ID in event.queryStringParameters){
      objectid = event.queryStringParameters[OBJ_ID]!
    }
  }

  switch(method){

    case http.GET:
      //get data back from DB and S3 bucket
      response = await getAlarmByTrackingId(objectid!, dbClient);
      break;

    default:
      response = ApigateWayProxyResult(400, 'no http method found >>' + method)
  }

  addCorsHeader(response);

  console.log(response);
  return response;
}


const getAlarmByTrackingId = async (objectID:string, dbClient:DynamoDBClient):Promise<APIGatewayProxyResult> => {

  try {
    console.log('object_id',objectID)
    const result = await dbClient.send(new ScanCommand({
      TableName: alarmTable,
      FilterExpression: 'object_id = :objectID',
      ExpressionAttributeValues: {
        ':objectID': { S: objectID },
      },
    }))

    
    if(result){ //Item has been found perform update

      console.log('updating Item');
      console.log(result.Items);

      return {
        statusCode:200,
        body: JSON.stringify({
          message:result.Items?.map((item)=>{
            return unmarshall(item)
          })
        })
      }
    } else { // create new Item
      console.log('creating new Item');
    }

    return {
      statusCode:200,
      body:JSON.stringify({})
    }
  }catch(error:any){
    console.log(error.message)
    return ApigateWayProxyResult(501, error.message)
  }
}