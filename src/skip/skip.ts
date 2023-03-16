import { Stack } from 'aws-cdk-lib';

/**
 * Decorator to skip all resources in a stack.
 *
 * If this is used on a class, it will remove all resources from the stack.
 * It's doing this by replacing the stack with an empty stack.
 *
 * @example
 * @Skip
 */
export function Skip(_: any): any {
  class Empty extends Stack {
    constructor() {
      super();
    }
  }
  return Empty;
}
