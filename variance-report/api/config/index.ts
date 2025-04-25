import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function config(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP function processed a request.');

    return {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
            AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
            AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT
        })
    };
} 