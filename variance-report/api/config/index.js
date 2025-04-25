const { app } = require('@azure/functions');

app.http('config', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP function processed a request.');

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
                AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
                AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT
            }
        };
    }
}); 