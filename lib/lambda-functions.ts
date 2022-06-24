import { Stack } from '@aws-cdk/core';
import { LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

import { defineLambda } from "./lambda-construct";

type LambdaType = Record<string, () => LambdaIntegration>;

const intergration = (func:any, template: Record<string, unknown>) => new LambdaIntegration(func, template);

const lambdaFunctions = (stack: Stack):LambdaType => {
    const functions: LambdaType = {
        fetchLightning: () => {
            const fetchLightning = defineLambda(stack, 'FetchLightning', 'lightning-poller', {});
            return intergration(fetchLightning, {
                requestTemplates: { "application/json": '{ "statusCode": "200" }' }
            }); 
        },
    };
    return functions;
};

export default lambdaFunctions;
