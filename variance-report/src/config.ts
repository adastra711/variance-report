// Configuration values for Azure OpenAI
const getConfigValue = async (key: string): Promise<string> => {
  try {
    // In production, fetch from Azure Static Web Apps configuration API
    if (import.meta.env.PROD) {
      const response = await fetch('/.auth/me');
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status}`);
      }
      const data = await response.json();
      console.log('Azure Static Web Apps config:', data);
      return data.clientPrincipal?.userDetails || '';
    }

    // In development, use local environment variables
    const value = import.meta.env[`VITE_${key}`];
    console.log(`Development value for ${key}:`, value);
    return value || '';
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return '';
  }
};

export const config = {
  azureOpenAI: {
    get apiKey() { return getConfigValue('AZURE_OPENAI_API_KEY'); },
    get endpoint() { return getConfigValue('AZURE_OPENAI_ENDPOINT'); },
    get deployment() { return getConfigValue('AZURE_OPENAI_DEPLOYMENT'); },
    apiVersion: "2024-02-15-preview"
  }
}; 