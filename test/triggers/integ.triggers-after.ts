import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { TriggerAfter } from '../../src/triggers/triggers';

const app = new App();

@TriggerAfter({
  code: Code.fromInline(`
      exports.handler = async (event) => {
        console.log('event: ', event)
      };
    `),
  handler: 'index.handler',
  runtime: Runtime.NODEJS_14_X,
})
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'TestBucket');
  }
}

const stack = new TestStack(app, 'TestStack');

new IntegTest(app, 'integ-test-triggers-before', {
  testCases: [stack],
});

app.synth();

