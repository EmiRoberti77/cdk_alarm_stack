#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UIDeploymentStack } from '../lib/UIDeploymentStack';
import { AlarmLambdaStack } from '../lib/AlarmLambdaStack';
import { ApiStack } from '../lib/ApiStack';
import { GetAlarmLambdaStack } from '../lib/GetAlarmLambdaStack';
import { ThumbNailBucket } from '../lib/ThumbNailBucket';
import { ThumbNailLambda } from '../lib/ThumbNailLambda';

const app = new cdk.App();


//create buckets for thumbnails
const thumbnailBucket = new ThumbNailBucket(app, 'alarmThumbNailBucket');

//create Lambda to put thumbnail into s3 bucket
const thumbNailLambda = new ThumbNailLambda(app, 'thumbNailAlarmLambda', {
  thumbBucket:thumbnailBucket.thumbNailBucket
})

//create Alarm Lambda
const alarmLambda = new AlarmLambdaStack(app, 'alarmLambdaStack');

//create Lambda get find out if event exists (dependent on first one because of dynamo table created in fist lambda)
const getAlarmLambda = new GetAlarmLambdaStack(app, 'getAlarmLambdaStack',{
  table:alarmLambda.table
});

new ApiStack(app, 'alarmApiUIStack', {
  lambdaIntegration: alarmLambda.lambdaIntegration,
  getLambdaIntegration: getAlarmLambda.lambdaIntegration,
  thumbLambdaIntegration: thumbNailLambda.thumbLambdaIntegration
})

new UIDeploymentStack(app, 'UIAlarm')