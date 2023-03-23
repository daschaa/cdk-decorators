import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { PrefixWith } from '../../src/prefixes/prefixes';

describe('PrefixWith', () => {
  @PrefixWith('Test')
  class TestStack extends Stack {
    constructor(scope: any, id: string) {
      super(scope, id);
      new Bucket(this, 'Bucket');
      new Queue(this, 'Queue');
    }
  }
  test('prefixes all resources', () => {
    const app = new App();
    const stack = new TestStack(app, 'TestStack');
    expect(Template.fromStack(stack)).toMatchSnapshot();
  });
});
