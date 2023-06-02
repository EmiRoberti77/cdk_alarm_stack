#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UIDeploymentStack } from '../lib/UIDeploymentStack';
import { AlarmLambdaStack } from '../lib/AlarmLambdaStack';
import { ApiStack } from '../lib/ApiStack';
import { GetAlarmLambdaStack } from '../lib/GetAlarmLambdaStack';

const app = new cdk.App();

//create first lamba
const alarmLambda = new AlarmLambdaStack(app, 'alarmLambdaStack');

//create second lambda (dependent on first one because of dynamo table created in fist lambda)
const getAlarmLambda = new GetAlarmLambdaStack(app, 'getAlarmLambdaStack',{
  table:alarmLambda.table
});

new ApiStack(app, 'alarmApiUIStack', {
  lambdaIntegration: alarmLambda.lambdaIntegration,
  getLambdaIntegration: getAlarmLambda.lambdaIntegration
})

new UIDeploymentStack(app, 'UIAlarm')