const { typescript } = require('projen');
const { ReleaseTrigger } = require('projen/lib/release');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'cdk-decorators',
  authorEmail: 'josh@joshuaw.de',
  authorName: 'Joshua Weber',
  authorUrl: 'https://github.com/daschaa',
  bugsUrl: 'https://github.com/daschaa/cdk-decorators/issues',
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
  releaseTrigger: ReleaseTrigger.manual({
    changelog: true,
  }),
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

const docsWorkflow = project.github.addWorkflow('docs', {
  permissions: {
    contents: 'read',
    pages: 'write',
    idToken: 'write',
  },
  concurrency: {
    group: 'pages',
    cancelInProgress: false,
  },
});

docsWorkflow.on({
  release: {
    types: ['published'],
  },
  workflowDispatch: {},
});

docsWorkflow.addJob('docs', {
  concurrency: {
    'group': 'pages',
    'cancel-in-progress': false,
  },
  permissions: {
    contents: 'read',
    pages: 'write',
    idToken: 'write',
  },
  environment: {
    name: 'github-pages',
    url: '${{ steps.deployment.outputs.page_url }}',
  },
  runsOn: 'ubuntu-latest',
  steps: [
    {
      name: 'Checkout',
      uses: 'actions/checkout@v3',
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
      name: 'Setup Pages',
      uses: 'actions/configure-pages@v3',
    },
    {
      name: 'Upload artifact',
      uses: 'actions/upload-pages-artifact@v1',
      with: {
        path: 'docs',
      },
    },
    {
      name: 'Deploy to GitHub Pages',
      id: 'deployment',
      uses: 'actions/deploy-pages@v1',
    },
  ],
});

const integrationTestWorkflow = project.github.addWorkflow('pr-test');
integrationTestWorkflow.on({
  pullRequest: {},
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
