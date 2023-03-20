import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { TriggerAfter } from '../../src/triggers/triggers';

describe('TriggerAfter', () => {

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

  test('creates trigger for stack', () => {
    const app = new App();
    const stack = new TestStack(app, 'TestStack');
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
