import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, ResourceOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps{
  lambdaIntegration:LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope:Construct, id:string, props:ApiStackProps){
    super(scope, id, props);

    const api = new RestApi(this, 'alarmuiapi');

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions:{
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    }

    const apiResources = api.root.addResource('alarms', optionsWithCors);

    apiResources.addMethod('POST', props.lambdaIntegration)
  }
}