import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { postAlarm } from './postAlarm';
import {http, ApigateWayProxyResult, addCorsHeader} from './util'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getAlarms } from './getAlarms';
import { updateAlarms } from './updateAlarms';

const dbClient = new DynamoDBClient({});
export const handler = async (event:APIGatewayProxyEvent, context:Context):Promise<APIGatewayProxyResult> => {

  const method = event.httpMethod;
  let response:APIGatewayProxyResult;

  switch(method){
    case http.POST:
      response = await postAlarm(event, dbClient);
      break;
    case http.GET:
      //get data back from DB and S3 bucket
      response = await getAlarms(event, dbClient)
      break;
      case http.PUT:
        //get data back from DB and S3 bucket
        response = ApigateWayProxyResult(403, 'PUT methos has been removed for this version of the API')
      break;
      case http.DELETE:
        response = ApigateWayProxyResult(404, 'DELETE alaram function not implememted yet')
        break;
    default:
      response = ApigateWayProxyResult(400, 'no http method found >>' + method)
  }

  addCorsHeader(response);

  console.log(response);
  return response;
}

