import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { postAlarm } from './postAlarm';
import {http, ApigateWayProxyResult} from './util'

export const handler = async (event:APIGatewayProxyEvent, context:Context):Promise<APIGatewayProxyResult> => {

  const method = event.httpMethod;

  switch(method){
    case http.POST:
      return await postAlarm(event);
    case http.GET:
      //get data back from DB and S3 bucket
      return ApigateWayProxyResult(200,'all good >>' + method);
    default:
      return ApigateWayProxyResult(400, 'no http method found >>' + method)
  }
}

