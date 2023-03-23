import { Aspects, CfnElement, Stack } from 'aws-cdk-lib';

/**
 * Decorator to prefixes all resource ids in stack with a given string
 *
 * @param prefix the prefix to add to all resources
 * @example
 * ```typescript
 * @PrefixWith('Test')
 * class TestStack extends Stack {
 *  constructor(scope: any, id: string) {
 *    super(scope, id);
 *  }
 * }
 * ```
 */
export function PrefixWith(prefix: string): any {
  return function (stack: { new (...args: any[]): Stack }): any {
    class Prefixed extends stack {
      constructor(...args: any[]) {
        super(...args);
        Aspects.of(this).add({
          visit: (node) => {
            if (node instanceof CfnElement ) {
              const oldLogicalId = this.getLogicalId(node as any);
              this.renameLogicalId(oldLogicalId, `${prefix}${oldLogicalId}`);
            }
          },
        });
      }
    }
    return Prefixed;
  };
}
