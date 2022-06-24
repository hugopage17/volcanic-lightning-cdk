import { Construct, SecretValue } from '@aws-cdk/core';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, GitHubTrigger, CodeBuildAction, S3DeployAction } from '@aws-cdk/aws-codepipeline-actions';
import { PipelineProject, LinuxBuildImage, BuildSpec } from '@aws-cdk/aws-codebuild';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';

interface PipelineProps {
    s3Bucket: Bucket
}

class PipelineConstruct extends Construct {
    constructor(scope: Construct, id: string, props: PipelineProps) {
        super(scope, id);
        const { s3Bucket } = props;
    
        const sourceOutput = new Artifact();
        const buildArtifact = new Artifact();

        const buildRole = new Role(this, 'VolcanicLightningBuildRole', {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com'), 
        });
    
        new Pipeline(this, 'Pipeline', {
            pipelineName: 'volcanic-lightning-pipeline',
            stages: [
                {
                  stageName: 'Source',
                  actions: [
                    new GitHubSourceAction({
                        actionName: 'VolcanicLightningSourceStage',
                        output: sourceOutput,
                        oauthToken: SecretValue.plainText('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'),
                        trigger: GitHubTrigger.POLL,
                        owner: 'hugopage17',
                        repo: 'volcanic-lightning-ui',
                        branch: 'master',
                    }),
                ],
              },
              {
                stageName: 'Build',
                actions: [
                    new CodeBuildAction({
                        actionName: 'VolcanicLightningBuildAction',
                        input: sourceOutput,
                        outputs:[buildArtifact],
                        project: new PipelineProject(this, 'VolcanicLightningBuild', {
                            role: buildRole,
                            environment: {
                                buildImage: LinuxBuildImage.STANDARD_4_0,
                                privileged: true,
                            },
                            buildSpec: BuildSpec.fromSourceFilename('buildspec.yaml')
                        })
                    })
                ],
              },
              {
                stageName: 'Deploy',
                actions: [
                    new S3DeployAction({
                        actionName: 'VolcanicLightningDeployToS3',
                        bucket: s3Bucket,
                        input: buildArtifact,
                    }),
                ]
              }
              ]
        });
    }
}

export default PipelineConstruct;
