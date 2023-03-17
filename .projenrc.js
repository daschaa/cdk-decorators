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
  devDeps: [
    '@aws-cdk/integ-tests-alpha@^2.69.0-alpha.0',
    '@aws-cdk/integ-runner@^2.69.0',
  ],
  docgen: true,
  npmignore: [
    'git-conventional-commits.yaml',
  ],
  tsconfig: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
  tsconfigDev: {
    compilerOptions: {
      rootDir: '.',
      outDir: '.',
      experimentalDecorators: true,
    },
    include: ['**/*.ts'], // all typescript files recursively
  },
  gitignore: [
    '.idea',
    'cdk.out',
    'src/**/*.js',
    'test/**/*.js',
    'src/**/*.d.ts',
    'test/**/*.d.ts',
  ],
  release: true,
  majorVersion: 1,
  keywords: ['aws', 'cdk', 'decorators', 'constructs'],
  releaseToNpm: true,
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.addTask('integ', {
  receiveArgs: true,
  description: 'Runs integration tests',
  steps: [
    {
      exec: 'tsc --project tsconfig.dev.json',
    },
    {
      exec: 'integ-runner',
      receiveArgs: true,
    },
  ],
});
project.eslint.addOverride({
  files: ['test/**/*.ts'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
});
const integrationTestWorkflow = project.github.addWorkflow('pr-test');
integrationTestWorkflow.on({
  pullRequest: {
    types: ['opened', 'synchronize', 'reopened'],
  },
});
integrationTestWorkflow.addJob('integration-test', {
  permissions: {
    contents: 'read',
  },
  name: 'Integration Test',
  runsOn: 'ubuntu-latest',
  steps: [
    {
      name: 'Checkout',
      uses: 'actions/checkout@v3',
      with: {
        ref: '${{ github.event.pull_request.head.ref }}',
        repository: '${{ github.event.pull_request.head.repo.full_name }}',
      },
    },
    {
      name: 'Install dependencies',
      run: [
        'yarn install --check-files',
      ],
    },
    {
      Name: 'Build',
      run: [
        'npx projen build',
      ],
    },
    {
      name: 'Run integration tests',
      run: [
        'npx projen integ --dry-run',
      ],
    },
  ],
});
project.synth();
