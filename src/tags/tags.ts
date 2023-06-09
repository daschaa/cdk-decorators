import { Stack, Tags } from 'aws-cdk-lib';

/**
 * Decorator to add tags to a stack.
 *
 * If this is used on a class, it will add the tags to all resources in the stack.
 *
 * @param key tag key
 * @param value tag value
 * @example
 * ```typescript
 * @TagWith('my-tag', 'my-value')
 * class MyStack extends Stack {
 *  constructor(scope: any, id: string) {
 *   super(scope, id);
 *  }
 * }
 * ```
 */
export function TagWith(key: string, value: string): any {
  return function<T extends { new (...args: any[]): Stack }>(ctor: T) {
    return class extends ctor {
      constructor(...args: any[]) {
        super(...args);
        Tags.of(this).add(key, value);
      }
    };
  };
}
