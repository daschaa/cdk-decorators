import { Stack } from 'aws-cdk-lib';
import * as triggers from 'aws-cdk-lib/triggers';

/**
 * Decorator to run a lambda trigger after the stack deployment.
 *
 * @param triggerProps parameters for the trigger
 * @example
 * ```ts
 * @TriggerAfter({
 *   code: Code.fromInline(`
 *       exports.handler = async (event) => {
 *         console.log('event: ', event)
 *       };
 *     `),
 *   handler: 'index.handler',
 *   runtime: Runtime.NODEJS_14_X,
 * })
 * class TestStack extends Stack {
 *   constructor(scope: any, id: string) {
 *     super(scope, id);
 *   }
 * }
 * ```
 */
export function TriggerAfter(triggerProps: triggers.TriggerFunctionProps): any {
  return function<T extends { new (...args: any[]): Stack }>(ctor: T) {
    return class extends ctor {
      constructor(...args: any[]) {
        super(...args);
        const trigger = new triggers.TriggerFunction(this, 'TriggerAfter', triggerProps);
        trigger.executeAfter(this);
      }
    };
  };
}
