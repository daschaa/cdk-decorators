import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Skip } from '../../src/skip/skip';

describe('Skip', () => {
  @Skip
  // @ts-ignore
  class TestStack extends Stack {
    constructor(scope: any, id: string) {
      super(scope, id);
      new Bucket(this, 'MyBucket', {});
    }
  }
  test('should skip', () => {
    const app = new App();
    const testStack = new TestStack(app, 'TestStack');
    expect(Template.fromStack(testStack).toJSON()).toMatchSnapshot();
  });
});
