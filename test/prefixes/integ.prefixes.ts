import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { PrefixWith } from '../../src/prefixes/prefixes';

const app = new App();

@PrefixWith('Test')
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const stack = new TestStack(app, 'TestStack');
new IntegTest(app, 'prefix-integ-test', {
  testCases: [stack],
});

app.synth();
