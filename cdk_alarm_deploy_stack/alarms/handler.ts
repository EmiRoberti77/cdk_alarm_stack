import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { postAlarm } from './postAlarm';
import {http, ApigateWayProxyResult} from './util'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getAlarms } from './getAlarms';

const dbClient = new DynamoDBClient({});
export const handler = async (event:APIGatewayProxyEvent, context:Context):Promise<APIGatewayProxyResult> => {

  const method = event.httpMethod;

  switch(method){
    case http.POST:
      return await postAlarm(event, dbClient);
    case http.GET:
      //get data back from DB and S3 bucket
      return getAlarms(event, dbClient)
    default:
      return ApigateWayProxyResult(400, 'no http method found >>' + method)
  }
}

