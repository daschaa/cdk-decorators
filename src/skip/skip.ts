import { App, Stack } from 'aws-cdk-lib';

/**
 * Decorator to skip this stack from the CDK app.
 *
 * If this is used on a class, it will remove all instances of this stack
 * from the given CDK app.
 *
 * @param stack the stack constructor
 * @example
 * ```typescript
 * @Skip
 * class StackToSkip extends Stack {
 *   constructor(scope: any, id: string) {
 *    super(scope, id);
 *   }
 * }
 * ```
 */
export function Skip(stack: { new (...args: any[]): Stack }): any {
  class Empty extends stack {
    constructor(...args: any[]) {
      super(...args);
      let parent = this.node.scope;
      while ((parent?.node.scope ?? undefined) !== undefined) {
        parent = parent?.node.scope;
      }
      if (parent instanceof App) {
        parent.node.tryRemoveChild(this.node.id);
      }
    }
  }
  return Empty;
}
