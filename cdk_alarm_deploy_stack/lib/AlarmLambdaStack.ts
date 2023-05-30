import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { CfnOutcome } from "aws-cdk-lib/aws-frauddetector";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import {join} from 'path';

export class AlarmLambdaStack extends Stack {

  public lambdaIntegration:LambdaIntegration;

  constructor(scope: Construct, id:string, props?:StackProps){
    super(scope, id, props);

    //create table
    const alarmTable = new Table(this, 'alarmTable',{
      partitionKey:{
        name:'id',
        type: AttributeType.STRING
      },
      tableName:'alaramuitable'
    })

    //create lambda
    const alaramLambda = new NodejsFunction(this, 'alarmLambda', {
      runtime:Runtime.NODEJS_18_X,
      handler:'handler',
      entry: join(__dirname, '..', 'alarms', 'handler.ts'),
      environment:{
        ALARM_TABLE:alarmTable.tableName
      }
    });

    //create policy for dynamo
    alaramLambda.addToRolePolicy(new PolicyStatement({
      effect:Effect.ALLOW,
      resources:[alarmTable.tableArn],
      actions:['dynamodb:PutItem','dynamodb:Scan']
    }))

    //assign lambda integration to public variable so it can be read from outside this class
    this.lambdaIntegration = new LambdaIntegration(alaramLambda);

    //outputs
    new CfnOutput(this, 'alarmTableName', {
      value: alarmTable.tableName
    })

    new CfnOutput(this, 'alarmTableArn', {
      value: alarmTable.tableArn
    })

    new CfnOutput(this, 'alarmLambdaName', {
      value: alaramLambda.functionName
    })

    new CfnOutput(this, 'alarmLambdaArn', {
      value: alaramLambda.functionArn
    })
  }
}