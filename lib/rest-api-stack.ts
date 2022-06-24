import { Construct, Stack } from '@aws-cdk/core';
import { RestApi, DomainName, Cors } from "@aws-cdk/aws-apigateway";
import lambdaFunctions from './lambda-functions';

enum HTTPMethods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT'
}

class RestAPIStack extends Construct{
    public domainName?: DomainName;

    constructor(scope: Stack, id: string){
        super(scope, id);
        const functions = lambdaFunctions(scope);
        
        const api = new RestApi(scope, 'Global-Lightning-Rest-Api', {
            restApiName: "Global Lightning Rest API",
            description: "Rest API that interacts with gloabl lightning ui",
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        });

        const v0Endpoint = api.root.addResource('v0');
        const restEndpoint = v0Endpoint.addResource('rest');
        
        const lightning = restEndpoint.addResource('lightning');

        lightning.addMethod(HTTPMethods.GET, functions.fetchLightning());
        this.domainName = api.domainName;
    }
}

export default RestAPIStack;
