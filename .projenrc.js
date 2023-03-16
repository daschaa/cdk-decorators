const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'cdk-decorators',
  authorEmail: 'josh@joshuaw.de',
  authorName: 'Joshua Weber',
  authorUrl: 'https://github.com/daschaa',
  projectType: 'library',
  description: 'A collection of decorators for the AWS CDK',
  license: 'MIT',
  dependabot: true,
  deps: [
    'aws-cdk-lib',
    'constructs',
  ],
  tsconfig: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
  tsconfigDev: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
  gitignore: [
    '.idea',
  ],
  release: true,
  majorVersion: 1,
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.eslint.addOverride({
  files: ['test/**/*.ts'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
});
project.synth();
