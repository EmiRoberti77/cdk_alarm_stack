import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import {join} from 'path';

export class UIDeploymentStack extends Stack {
  public bucketname:string;
  public bucketArn:string;

  constructor(scope:Construct, id:string, props?:StackProps){
    super(scope, id, props);
    //get the UI path;
    const uiDir = join(__dirname, '..', '..', 'alarmpanel', 'build')
    if(!existsSync(uiDir)){
      console.log('Error: can not find application in ' + uiDir);
      return;
    } else {
      console.log('INFO-FOUND=>'+uiDir)
    }

    const uiApplicationBucket = new Bucket(this, 'alarmUIApplicatioBuket');

    this.bucketArn = uiApplicationBucket.bucketArn;
    this.bucketname = uiApplicationBucket.bucketName;

    //create a deplyoment 
    new BucketDeployment(this, 'uiAlarmDeploymentBucket', {
      destinationBucket:uiApplicationBucket,
      sources:[Source.asset(uiDir)]
    })

    //set policies
    const originIdentity = new OriginAccessIdentity(this, 'OriginIdentuty');
    uiApplicationBucket.grantReadWrite(originIdentity);

    const distribution = new Distribution(this, 'uiAlarmDistributionn',{
      defaultRootObject:'index.html',
      defaultBehavior:{
        origin:new S3Origin(uiApplicationBucket, {
          originAccessIdentity:originIdentity
        })
      }
    });

    new CfnOutput(this, 'bName',{
      value: this.bucketname
    });

    new CfnOutput(this, 'bArn',{
      value: this.bucketArn
    });

    new CfnOutput(this, 'deploymentOutput',{
      value: distribution.distributionDomainName
    });
  }
}