import { Stack, Duration } from '@aws-cdk/core';
import { Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';

export const defineLambda = (stack:Stack, name: string, file:string, env: any) => {
    return new NodejsFunction(stack, name, {
        memorySize: 1024,
        timeout: Duration.seconds(12),
        entry: path.join(__dirname, `/../lambdas/${file}.ts`),
        runtime: Runtime.NODEJS_14_X,
        bundling: {
            minify: true,
            externalModules: ['aws-sdk'],
        },
        handler: 'handler',
        environment: env
    });
};
