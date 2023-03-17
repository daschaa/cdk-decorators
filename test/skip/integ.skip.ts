import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Skip } from '../../src/skip/skip';

const app = new App();

@Skip
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {});
  }
}

class OtherStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Queue(this, 'MyQueue', {});
  }
}

const stack = new TestStack(app, 'TestStack');
const otherStack = new OtherStack(app, 'OtherStack');

new IntegTest(app, 'integ-test', {
  testCases: [stack, otherStack],
});

app.synth();
