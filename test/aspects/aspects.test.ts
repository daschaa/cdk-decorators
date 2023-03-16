import * as cdk from 'aws-cdk-lib';
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { IConstruct } from 'constructs';
import { Aspect } from '../../src';

describe('Aspects Annotation', () => {
  describe('Aspects as function', () => {
    @Aspect((node: IConstruct) => {
      if (node instanceof CfnBucket) {
        node.bucketName = 'aspect-has-overriden-this';
      }
    })
    // @ts-ignore
    class TestStack extends cdk.Stack {
      constructor(scope: any, id: string) {
        super(scope, id);
        new Bucket(this, 'MyBucket', {
          bucketName: 'test-bucket',
        });
        new Queue(this, 'MyQueue', {});
      }
    }
    test('should run aspect on every resource', () => {
      const app = new cdk.App();
      const testStack = new TestStack(app, 'TestStack');
      Template.fromStack(testStack).hasResourceProperties('AWS::S3::Bucket', Match.objectLike({
        BucketName: 'aspect-has-overriden-this',
      }));
    });
  });

  describe('Aspects as IAspect', () => {
    class MyAspect implements cdk.IAspect {
      public visit(node: IConstruct): void {
        if (node instanceof CfnBucket) {
          this.error(node, 'we do not want a bucket here');
        }
      }

      protected error(node: IConstruct, message: string): void {
        cdk.Annotations.of(node).addError(message);
      }
    }

    @Aspect(new MyAspect())
    // @ts-ignore
    class TestStackWithAspectObject extends cdk.Stack {
      constructor(scope: any, id: string) {
        super(scope, id);
        new Bucket(this, 'MyBucket', {
          bucketName: 'test-bucket',
        });
        new Queue(this, 'MyQueue', {});
      }
    }
    test('should run aspect on every resource', () => {
      const app = new cdk.App();
      const testStack = new TestStackWithAspectObject(app, 'TestStack');
      Annotations.fromStack(testStack).hasError('/TestStack/MyBucket/Resource', 'we do not want a bucket here');
    });
  });
});
