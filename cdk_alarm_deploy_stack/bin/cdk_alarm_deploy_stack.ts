#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UIDeploymentStack } from '../lib/UIDeploymentStack';
import { AlarmLambdaStack } from '../lib/AlarmLambdaStack';
import { ApiStack } from '../lib/ApiStack';

const app = new cdk.App();

const alarmLambda = new AlarmLambdaStack(app, 'alarmLambdaStack');

new ApiStack(app, 'alarmApiUIStack', {
  lambdaIntegration: alarmLambda.lambdaIntegration
})

new UIDeploymentStack(app, 'UIAlarm')