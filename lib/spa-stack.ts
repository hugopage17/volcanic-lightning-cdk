import { CloudFrontWebDistribution, CloudFrontWebDistributionProps, OriginAccessIdentity, CfnDistribution } from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct, RemovalPolicy, Stack } from '@aws-cdk/core';

class SpaStack extends Construct {
    public cloudfrontUrl: string;
    public s3Bucket: Bucket;

	constructor(scope: Stack, id: string) {
		super(scope, id);

		const bucket = new Bucket(this, 'volcanic-lightning-ui', {
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: 'index.html',
			removalPolicy: RemovalPolicy.DESTROY,
		});

        this.s3Bucket = bucket;

		const cloudFrontOAI = new OriginAccessIdentity(this, 'OAI', {
			comment: 'OAI for the volcanic lightning UI.',
		});

		const errorResponse: CfnDistribution.CustomErrorResponseProperty = {
			errorCachingMinTtl: 10,
			errorCode: 403,
			responseCode: 200,
			responsePagePath: '/index.html'
		};

		const cloudFrontDistProps: CloudFrontWebDistributionProps = {
			originConfigs: [
				{
					s3OriginSource: {
						s3BucketSource: bucket,
						originAccessIdentity: cloudFrontOAI,
					},
					behaviors: [{ isDefaultBehavior: true }],

				},
			],
			errorConfigurations:[errorResponse],
		};

		const cloudfrontDistribution = new CloudFrontWebDistribution(this, 'volcanic-lightning-cdn', cloudFrontDistProps);
        this.cloudfrontUrl = cloudfrontDistribution.distributionDomainName;
	};
};

export default SpaStack;
