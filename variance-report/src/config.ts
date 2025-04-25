// Configuration values for Azure OpenAI
const getConfigValue = async (key: string): Promise<string> => {
  try {
    // In Azure Static Web Apps, we can fetch the configuration from the API
    if (import.meta.env.PROD) {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        console.log(`Found ${key} in API config:`, config[key]);
        return config[key] || "";
      }
    }

    // Fall back to environment variables for development
    const value = import.meta.env[`VITE_${key}`];
    console.log(`Using ${key} from env:`, value);
    return value || "";
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return "";
  }
};

// Export configuration with fallback values
export const config = {
  azureOpenAI: {
    get apiKey() { return getConfigValue('AZURE_OPENAI_API_KEY'); },
    get endpoint() { return getConfigValue('AZURE_OPENAI_ENDPOINT'); },
    get deployment() { return getConfigValue('AZURE_OPENAI_DEPLOYMENT'); },
    apiVersion: "2024-02-15-preview"
  }
}; 