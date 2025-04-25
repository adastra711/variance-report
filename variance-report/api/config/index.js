module.exports = async function (context, req) {
    try {
        // Get configuration values from environment
        const config = {
            AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
            AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
            AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT
        };

        // Log what we found (but not the actual API key value)
        context.log('Config values found:', {
            hasApiKey: !!config.AZURE_OPENAI_API_KEY,
            endpoint: config.AZURE_OPENAI_ENDPOINT,
            deployment: config.AZURE_OPENAI_DEPLOYMENT
        });

        context.res = {
            headers: {
                'Content-Type': 'application/json'
            },
            body: config
        };
    } catch (error) {
        context.log.error('Error in config function:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                error: 'Failed to retrieve configuration'
            }
        };
    }
}; 