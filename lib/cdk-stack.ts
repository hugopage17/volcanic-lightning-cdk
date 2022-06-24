import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as amplify from '@aws-cdk/aws-amplify';
import RestAPIStack from './rest-api-stack';
import SpaStack from './spa-stack';
import PipelineConstruct from './code-pipeline-construct';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new RestAPIStack(this, id)

    // const spa = new SpaStack(this, 'VolcanicLightningSPA');

    // new PipelineConstruct(this, 'VolcanicLightningPipeline', { s3Bucket:spa.s3Bucket })

    const amplifyApp = new amplify.App(this, 'Volcanic Lightning', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'hugopage17',
        repository: 'volcanic-lightning-ui',
        oauthToken: cdk.SecretValue.plainText('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')
      }),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('amplify.yml'),
    });

    const dev = amplifyApp.addBranch('master');
    dev.addEnvironment('STAGE', 'prod');
    amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
  }
}
