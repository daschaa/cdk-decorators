import { Stack } from 'aws-cdk-lib';

/**
 * Decorator to skip all resources in a stack.
 *
 * If this is used on a class, it will remove all resources from the stack.
 * It's doing this by removing all nodes from the stack.
 *
 * @example
 * @Skip
 */
export function Skip<T extends { new (...args: any[]): Stack }>(ctor: T): any {
  return class extends ctor {
    constructor(...args: any[]) {
      super(...args);
      const children = this.node.findAll();
      children.forEach((child) => {
        this.node.tryRemoveChild(child.node.id);
      });
    }
  };
}
