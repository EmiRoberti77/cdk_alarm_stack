import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { CfnOutcome } from "aws-cdk-lib/aws-frauddetector";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import {join} from 'path';

interface GetAlarmLambdaStackProps extends StackProps {
  table:Table;
}

export class GetAlarmLambdaStack extends Stack {

  public lambdaIntegration:LambdaIntegration;

  constructor(scope: Construct, id:string, props:GetAlarmLambdaStackProps){
    super(scope, id, props);

    //create lambda
    const alaramLambda = new NodejsFunction(this, 'getalarmLambda', {
      runtime:Runtime.NODEJS_18_X,
      handler:'handler',
      entry: join(__dirname, '..', 'getalarms', 'handler.ts'),
      environment:{
        ALARM_TABLE: props.table.tableName
      }
    });

    //create policy for dynamo
    alaramLambda.addToRolePolicy(new PolicyStatement({
      effect:Effect.ALLOW,
      resources:[props.table.tableArn],
      actions:['*']
    }))

    //assign lambda integration to public variable so it can be read from outside this class
    this.lambdaIntegration = new LambdaIntegration(alaramLambda);

    //outputs
    new CfnOutput(this, 'alarmTableName', {
      value: props.table.tableName
    })

    new CfnOutput(this, 'alarmTableArn', {
      value: props.table.tableArn
    })

    new CfnOutput(this, 'alarmLambdaName', {
      value: alaramLambda.functionName
    })

    new CfnOutput(this, 'alarmLambdaArn', {
      value: alaramLambda.functionArn
    })
  }
}