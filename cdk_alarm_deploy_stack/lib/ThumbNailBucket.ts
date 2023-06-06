import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket, BucketAccessControl, HttpMethods, IBucket, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";


export class ThumbNailBucket extends Stack {
  public thumbNailBucket:Bucket;

  constructor(scope:Construct, id:string, props?:StackProps) {
    super(scope, id, props)

    this.createStack();
  }

  private createStack() {
    this.thumbNailBucket = new Bucket(this, 'thumbnailAlarmBucket', {
      bucketName:'thumbnailalarmbucket',
      cors:[{
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.PUT
        ],
        allowedOrigins:['*'],
        allowedHeaders:['*']
      }],

      // accessControl: BucketAccessControl.PUBLIC_READ // currently not working,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false
      }
    });
    
    new CfnOutput(this, 'thumbnailBuketnameARN',{
      value:this.thumbNailBucket.bucketArn
    })

    new CfnOutput(this, 'thumbnailBuketnameName',{
      value:this.thumbNailBucket.bucketName
    })
  }
}