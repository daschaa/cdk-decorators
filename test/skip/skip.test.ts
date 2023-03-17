import { App, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Skip } from '../../lib/skip/skip';

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
    // GIVEN
    const app = new App();

    // WHEN
    new TestStack(app, 'TestStack');

    // THEN
    expect(app.node.tryFindChild('TestStack')).toBeUndefined();
  });

  test('should skip nested stacks', () => {
    const app = new App();
    class ParentStack extends Stack {
      constructor(scope: any, id: string) {
        super(scope, id);
        new Queue(this, 'MyQueue', {});
        new TestStack(this, 'TestStack');
      }
    }
    new ParentStack(app, 'ParentStack');

    expect(app.node.tryFindChild('TestStack')).toBeUndefined();
    expect(app.node.tryFindChild('ParentStack')).toBeDefined();
  });

  test('should skip nested stacks when scope passed', () => {
    const app = new App();
    class ParentStack extends Stack {
      constructor(scope: any, id: string) {
        super(scope, id);
        new Queue(this, 'MyQueue', {});
        new TestStack(scope, 'TestStack');
      }
    }
    new ParentStack(app, 'ParentStack');

    expect(app.node.tryFindChild('TestStack')).toBeUndefined();
    expect(app.node.tryFindChild('ParentStack')).toBeDefined();
  });
});
