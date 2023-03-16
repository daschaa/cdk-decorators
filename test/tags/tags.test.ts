import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { TagWith } from '../../src';

@TagWith('MyTag', 'MyValue')
// @ts-ignore
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {
      bucketName: 'test-bucket',
    });
    new Queue(this, 'MyQueue', {});
  }
}
describe('Tag Annotation', () => {
  test('should add tag to stack', () => {
    const testStack = new TestStack(new App(), 'TestStack');
    Template.fromStack(testStack).hasResourceProperties('AWS::S3::Bucket', Match.objectLike({
      Tags: [
        {
          Key: 'MyTag',
          Value: 'MyValue',
        },
      ],
    }));

    Template.fromStack(testStack).hasResourceProperties('AWS::SQS::Queue', Match.objectLike({
      Tags: [
        {
          Key: 'MyTag',
          Value: 'MyValue',
        },
      ],
    }));
  });
});
