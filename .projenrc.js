"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const projen_1 = require("projen");
const workflows_model_1 = require("projen/lib/github/workflows-model");
const release_1 = require("projen/lib/release");
const project = new projen_1.typescript.TypeScriptProject({
    defaultReleaseBranch: 'main',
    name: 'cdk-decorators',
    authorEmail: 'josh@joshuaw.de',
    authorName: 'Joshua Weber',
    authorUrl: 'https://github.com/daschaa',
    bugsUrl: 'https://github.com/daschaa/cdk-decorators/issues',
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
    releaseTrigger: release_1.ReleaseTrigger.manual({
        changelog: true,
    }),
    projenrcTs: true,
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
(_a = project.eslint) === null || _a === void 0 ? void 0 : _a.addOverride({
    files: ['test/**/*.ts'],
    rules: {
        'import/no-extraneous-dependencies': 'off',
    },
});
function createDocumentationWorkflow() {
    var _a;
    const docsWorkflow = (_a = project.github) === null || _a === void 0 ? void 0 : _a.addWorkflow('docs');
    if (!docsWorkflow) {
        return;
    }
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
            contents: workflows_model_1.JobPermission.READ,
            pages: workflows_model_1.JobPermission.WRITE,
            idToken: workflows_model_1.JobPermission.WRITE,
        },
        environment: {
            name: 'github-pages',
            url: '${{ steps.deployment.outputs.page_url }}',
        },
        runsOn: ['ubuntu-latest'],
        steps: [
            {
                name: 'Checkout',
                uses: 'actions/checkout@v3',
            },
            {
                name: 'Install dependencies',
                run: 'yarn install --check-files',
            },
            {
                name: 'Build',
                run: 'npx projen build',
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
}
createDocumentationWorkflow();
function createIntegTestWorkflow() {
    var _a;
    const integrationTestWorkflow = (_a = project.github) === null || _a === void 0 ? void 0 : _a.addWorkflow('pr-test');
    if (!integrationTestWorkflow) {
        return;
    }
    integrationTestWorkflow.on({
        pullRequest: {},
    });
    integrationTestWorkflow.addJob('integration-test', {
        permissions: {
            contents: workflows_model_1.JobPermission.READ,
        },
        name: 'Integration Test',
        runsOn: ['ubuntu-latest'],
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
                run: 'yarn install --check-files',
            },
            {
                name: 'Build',
                run: 'npx projen build',
            },
            {
                name: 'Run integration tests',
                run: 'npx projen integ --dry-run',
            },
        ],
    });
}
createIntegTestWorkflow();
project.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLnByb2plbnJjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLnByb2plbnJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQUNwQyx1RUFBa0U7QUFDbEUsZ0RBQW9EO0FBR3BELE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQVUsQ0FBQyxpQkFBaUIsQ0FBQztJQUMvQyxvQkFBb0IsRUFBRSxNQUFNO0lBQzVCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsV0FBVyxFQUFFLGlCQUFpQjtJQUM5QixVQUFVLEVBQUUsY0FBYztJQUMxQixTQUFTLEVBQUUsNEJBQTRCO0lBQ3ZDLE9BQU8sRUFBRSxrREFBa0Q7SUFDM0QsV0FBVyxFQUFFLDRDQUE0QztJQUN6RCxPQUFPLEVBQUUsS0FBSztJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLElBQUksRUFBRTtRQUNKLGFBQWE7UUFDYixZQUFZO0tBQ2I7SUFDRCxPQUFPLEVBQUU7UUFDUCw0Q0FBNEM7UUFDNUMsK0JBQStCO0tBQ2hDO0lBQ0QsTUFBTSxFQUFFLElBQUk7SUFDWixTQUFTLEVBQUU7UUFDVCwrQkFBK0I7S0FDaEM7SUFDRCxRQUFRLEVBQUU7UUFDUixlQUFlLEVBQUU7WUFDZixzQkFBc0IsRUFBRSxJQUFJO1NBQzdCO0tBQ0Y7SUFDRCxXQUFXLEVBQUU7UUFDWCxlQUFlLEVBQUU7WUFDZixPQUFPLEVBQUUsR0FBRztZQUNaLE1BQU0sRUFBRSxHQUFHO1lBQ1gsc0JBQXNCLEVBQUUsSUFBSTtTQUM3QjtRQUNELE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLG1DQUFtQztLQUMxRDtJQUNELFNBQVMsRUFBRTtRQUNULE9BQU87UUFDUCxTQUFTO1FBQ1QsYUFBYTtRQUNiLGNBQWM7UUFDZCxlQUFlO1FBQ2YsZ0JBQWdCO0tBQ2pCO0lBQ0QsT0FBTyxFQUFFLElBQUk7SUFDYixZQUFZLEVBQUUsQ0FBQztJQUNmLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVB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N0I7UUFDRCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUN6QixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLHFCQUFxQjtnQkFDM0IsSUFBSSxFQUFFO29CQUNKLEdBQUcsRUFBRSwyQ0FBMkM7b0JBQ2hELFVBQVUsRUFBRSxzREFBc0Q7aUJBQ25FO2FBQ0Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixHQUFHLEVBQUUsNEJBQTRCO2FBQ2xDO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsR0FBRyxFQUFFLGtCQUFrQjthQUN4QjtZQUNEO2dCQUNFLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLEdBQUcsRUFBRSw0QkFBNEI7YUFDbEM7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCx1QkFBdUIsRUFBRSxDQUFDO0FBRTFCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGVzY3JpcHQgfSBmcm9tICdwcm9qZW4nO1xuaW1wb3J0IHsgSm9iUGVybWlzc2lvbiB9IGZyb20gJ3Byb2plbi9saWIvZ2l0aHViL3dvcmtmbG93cy1tb2RlbCc7XG5pbXBvcnQgeyBSZWxlYXNlVHJpZ2dlciB9IGZyb20gJ3Byb2plbi9saWIvcmVsZWFzZSc7XG5pbXBvcnQgeyBUeXBlU2NyaXB0UHJvamVjdE9wdGlvbnMgfSBmcm9tICdwcm9qZW4vbGliL3R5cGVzY3JpcHQnO1xuXG5jb25zdCBwcm9qZWN0ID0gbmV3IHR5cGVzY3JpcHQuVHlwZVNjcmlwdFByb2plY3Qoe1xuICBkZWZhdWx0UmVsZWFzZUJyYW5jaDogJ21haW4nLFxuICBuYW1lOiAnY2RrLWRlY29yYXRvcnMnLFxuICBhdXRob3JFbWFpbDogJ2pvc2hAam9zaHVhdy5kZScsXG4gIGF1dGhvck5hbWU6ICdKb3NodWEgV2ViZXInLFxuICBhdXRob3JVcmw6ICdodHRwczovL2dpdGh1Yi5jb20vZGFzY2hhYScsXG4gIGJ1Z3NVcmw6ICdodHRwczovL2dpdGh1Yi5jb20vZGFzY2hhYS9jZGstZGVjb3JhdG9ycy9pc3N1ZXMnLFxuICBkZXNjcmlwdGlvbjogJ0EgY29sbGVjdGlvbiBvZiBkZWNvcmF0b3JzIGZvciB0aGUgQVdTIENESycsXG4gIGxpY2Vuc2U6ICdNSVQnLFxuICBkZXBlbmRhYm90OiB0cnVlLFxuICBkZXBzOiBbXG4gICAgJ2F3cy1jZGstbGliJyxcbiAgICAnY29uc3RydWN0cycsXG4gIF0sXG4gIGRldkRlcHM6IFtcbiAgICAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGFAXjIuNjkuMC1hbHBoYS4wJyxcbiAgICAnQGF3cy1jZGsvaW50ZWctcnVubmVyQF4yLjY5LjAnLFxuICBdLFxuICBkb2NnZW46IHRydWUsXG4gIG5wbWlnbm9yZTogW1xuICAgICdnaXQtY29udmVudGlvbmFsLWNvbW1pdHMueWFtbCcsXG4gIF0sXG4gIHRzY29uZmlnOiB7XG4gICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICBleHBlcmltZW50YWxEZWNvcmF0b3JzOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIHRzY29uZmlnRGV2OiB7XG4gICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICByb290RGlyOiAnLicsXG4gICAgICBvdXREaXI6ICcuJyxcbiAgICAgIGV4cGVyaW1lbnRhbERlY29yYXRvcnM6IHRydWUsXG4gICAgfSxcbiAgICBpbmNsdWRlOiBbJyoqLyoudHMnXSwgLy8gYWxsIHR5cGVzY3JpcHQgZmlsZXMgcmVjdXJzaXZlbHlcbiAgfSxcbiAgZ2l0aWdub3JlOiBbXG4gICAgJy5pZGVhJyxcbiAgICAnY2RrLm91dCcsXG4gICAgJ3NyYy8qKi8qLmpzJyxcbiAgICAndGVzdC8qKi8qLmpzJyxcbiAgICAnc3JjLyoqLyouZC50cycsXG4gICAgJ3Rlc3QvKiovKi5kLnRzJyxcbiAgXSxcbiAgcmVsZWFzZTogdHJ1ZSxcbiAgbWFqb3JWZXJzaW9uOiAxLFxuICBrZXl3b3JkczogWydhd3MnLCAnY2RrJywgJ2RlY29yYXRvcnMnLCAnY29uc3RydWN0cyddLFxuICByZWxlYXNlVG9OcG06IHRydWUsXG4gIHJlbGVhc2VUcmlnZ2VyOiBSZWxlYXNlVHJpZ2dlci5tYW51YWwoe1xuICAgIGNoYW5nZWxvZzogdHJ1ZSxcbiAgfSksXG4gIHByb2plbnJjVHM6IHRydWUsXG59IGFzIFR5cGVTY3JpcHRQcm9qZWN0T3B0aW9ucyk7XG5wcm9qZWN0LmFkZFRhc2soJ2ludGVnJywge1xuICByZWNlaXZlQXJnczogdHJ1ZSxcbiAgZGVzY3JpcHRpb246ICdSdW5zIGludGVncmF0aW9uIHRlc3RzJyxcbiAgc3RlcHM6IFtcbiAgICB7XG4gICAgICBleGVjOiAndHNjIC0tcHJvamVjdCB0c2NvbmZpZy5kZXYuanNvbicsXG4gICAgfSxcbiAgICB7XG4gICAgICBleGVjOiAnaW50ZWctcnVubmVyJyxcbiAgICAgIHJlY2VpdmVBcmdzOiB0cnVlLFxuICAgIH0sXG4gIF0sXG59KTtcbnByb2plY3QuZXNsaW50Py5hZGRPdmVycmlkZSh7XG4gIGZpbGVzOiBbJ3Rlc3QvKiovKi50cyddLFxuICBydWxlczoge1xuICAgICdpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMnOiAnb2ZmJyxcbiAgfSxcbn0pO1xuXG5mdW5jdGlvbiBjcmVhdGVEb2N1bWVudGF0aW9uV29ya2Zsb3coKSB7XG4gIGNvbnN0IGRvY3NXb3JrZmxvdyA9IHByb2plY3QuZ2l0aHViPy5hZGRXb3JrZmxvdygnZG9jcycpO1xuXG4gIGlmICghZG9jc1dvcmtmbG93KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZG9jc1dvcmtmbG93Lm9uKHtcbiAgICByZWxlYXNlOiB7XG4gICAgICB0eXBlczogWydwdWJsaXNoZWQnXSxcbiAgICB9LFxuICAgIHdvcmtmbG93RGlzcGF0Y2g6IHt9LFxuICB9KTtcblxuICBkb2NzV29ya2Zsb3cuYWRkSm9iKCdkb2NzJywge1xuICAgIGNvbmN1cnJlbmN5OiB7XG4gICAgICAnZ3JvdXAnOiAncGFnZXMnLFxuICAgICAgJ2NhbmNlbC1pbi1wcm9ncmVzcyc6IGZhbHNlLFxuICAgIH0sXG4gICAgcGVybWlzc2lvbnM6IHtcbiAgICAgIGNvbnRlbnRzOiBKb2JQZXJtaXNzaW9uLlJFQUQsXG4gICAgICBwYWdlczogSm9iUGVybWlzc2lvbi5XUklURSxcbiAgICAgIGlkVG9rZW46IEpvYlBlcm1pc3Npb24uV1JJVEUsXG4gICAgfSxcbiAgICBlbnZpcm9ubWVudDoge1xuICAgICAgbmFtZTogJ2dpdGh1Yi1wYWdlcycsXG4gICAgICB1cmw6ICcke3sgc3RlcHMuZGVwbG95bWVudC5vdXRwdXRzLnBhZ2VfdXJsIH19JyxcbiAgICB9LFxuICAgIHJ1bnNPbjogWyd1YnVudHUtbGF0ZXN0J10sXG4gICAgc3RlcHM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0NoZWNrb3V0JyxcbiAgICAgICAgdXNlczogJ2FjdGlvbnMvY2hlY2tvdXRAdjMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0luc3RhbGwgZGVwZW5kZW5jaWVzJyxcbiAgICAgICAgcnVuOiAneWFybiBpbnN0YWxsIC0tY2hlY2stZmlsZXMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0J1aWxkJyxcbiAgICAgICAgcnVuOiAnbnB4IHByb2plbiBidWlsZCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnU2V0dXAgUGFnZXMnLFxuICAgICAgICB1c2VzOiAnYWN0aW9ucy9jb25maWd1cmUtcGFnZXNAdjMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1VwbG9hZCBhcnRpZmFjdCcsXG4gICAgICAgIHVzZXM6ICdhY3Rpb25zL3VwbG9hZC1wYWdlcy1hcnRpZmFjdEB2MScsXG4gICAgICAgIHdpdGg6IHtcbiAgICAgICAgICBwYXRoOiAnZG9jcycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnRGVwbG95IHRvIEdpdEh1YiBQYWdlcycsXG4gICAgICAgIGlkOiAnZGVwbG95bWVudCcsXG4gICAgICAgIHVzZXM6ICdhY3Rpb25zL2RlcGxveS1wYWdlc0B2MScsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG59XG5cbmNyZWF0ZURvY3VtZW50YXRpb25Xb3JrZmxvdygpO1xuXG5mdW5jdGlvbiBjcmVhdGVJbnRlZ1Rlc3RXb3JrZmxvdygpIHtcbiAgY29uc3QgaW50ZWdyYXRpb25UZXN0V29ya2Zsb3cgPSBwcm9qZWN0LmdpdGh1Yj8uYWRkV29ya2Zsb3coJ3ByLXRlc3QnKTtcblxuICBpZiAoIWludGVncmF0aW9uVGVzdFdvcmtmbG93KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaW50ZWdyYXRpb25UZXN0V29ya2Zsb3cub24oe1xuICAgIHB1bGxSZXF1ZXN0OiB7fSxcbiAgfSk7XG4gIGludGVncmF0aW9uVGVzdFdvcmtmbG93LmFkZEpvYignaW50ZWdyYXRpb24tdGVzdCcsIHtcbiAgICBwZXJtaXNzaW9uczoge1xuICAgICAgY29udGVudHM6IEpvYlBlcm1pc3Npb24uUkVBRCxcbiAgICB9LFxuICAgIG5hbWU6ICdJbnRlZ3JhdGlvbiBUZXN0JyxcbiAgICBydW5zT246IFsndWJ1bnR1LWxhdGVzdCddLFxuICAgIHN0ZXBzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdDaGVja291dCcsXG4gICAgICAgIHVzZXM6ICdhY3Rpb25zL2NoZWNrb3V0QHYzJyxcbiAgICAgICAgd2l0aDoge1xuICAgICAgICAgIHJlZjogJyR7eyBnaXRodWIuZXZlbnQucHVsbF9yZXF1ZXN0LmhlYWQucmVmIH19JyxcbiAgICAgICAgICByZXBvc2l0b3J5OiAnJHt7IGdpdGh1Yi5ldmVudC5wdWxsX3JlcXVlc3QuaGVhZC5yZXBvLmZ1bGxfbmFtZSB9fScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnSW5zdGFsbCBkZXBlbmRlbmNpZXMnLFxuICAgICAgICBydW46ICd5YXJuIGluc3RhbGwgLS1jaGVjay1maWxlcycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnQnVpbGQnLFxuICAgICAgICBydW46ICducHggcHJvamVuIGJ1aWxkJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdSdW4gaW50ZWdyYXRpb24gdGVzdHMnLFxuICAgICAgICBydW46ICducHggcHJvamVuIGludGVnIC0tZHJ5LXJ1bicsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufVxuXG5jcmVhdGVJbnRlZ1Rlc3RXb3JrZmxvdygpO1xuXG5wcm9qZWN0LnN5bnRoKCk7XG4iXX0=