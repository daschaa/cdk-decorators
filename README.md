# 📎TypeScript Decorators for AWS CDK

This is a collection of TypeScript decorators for AWS Cloud Development Kit (CDK) that aims to make the code more aesthetically pleasing.

> _Note: This is not an official project from AWS._

## Usage

The library provides a set of decorators that can be used to annotate your CDK classes. Here's an example:

```typescript
@TagWith('my-tag', 'my-value')
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {});
  }
}
```

In this example, we're using the `@TagWith` decorator to annotate the class. The `@TagWith` decorator takes two arguments:
- `@TagWith(key?: string, value?: string)`: Adds a tag to all the resources in the stack with the specified key and value.

## Decorators

### `TagWith`

Adds a tag to all the resources in the stack with the specified key and value.

```typescript
@TagWith('my-tag', 'my-value')
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {});
  }
}
```

### `Aspect`

Adds aspects to the stack.

```typescript
@Aspect((node: IConstruct) => {
  if (node instanceof CfnBucket) {
    node.bucketName = 'my-bucket';
  }
})
class TestStack extends Stack {
  constructor(scope: any, id: string) {
    super(scope, id);
    new Bucket(this, 'MyBucket', {});
  }
}
```

### Contributing 

Contributions are welcome! If you find a bug or have an idea for a new feature, feel free to open an issue or submit a pull request.

Before submitting a pull request, please make sure to run the tests:

```bash
yarn test
```

### License

This library is licensed under the MIT License. See the LICENSE file for more information.
