import { APIGatewayProxyHandler } from 'aws-lambda';
import lightningPoller from "../api/lightning-poller"

const handler: APIGatewayProxyHandler = async (): Promise<any> => {
    const res = await lightningPoller()
    return {
        statusCode: '200',
        body: JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }
}

export { handler }
