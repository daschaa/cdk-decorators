import { Aspects, IAspect, Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

/**
 * Decorator to add aspects to a stack.
 *
 * If this is used on a class, it will run the aspects on the stack after the stack is created.
 *
 * @param aspect the aspect to add which can be a function or an IAspect
 */
export function Aspect(aspect: ((node: IConstruct) => void) | IAspect): any {
  return function<T extends { new (...args: any[]): Stack }>(ctor: T) {
    return class extends ctor {
      constructor(...args: any[]) {
        super(...args);
        if (typeof aspect === 'function') {
          Aspects.of(this).add({
            visit: aspect,
          });
        } else {
          Aspects.of(this).add(aspect);
        }
      }
    };
  };
}
