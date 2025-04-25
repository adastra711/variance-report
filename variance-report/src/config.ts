// Configuration values for Azure OpenAI
const getConfigValue = async (key: string): Promise<string> => {
  try {
    // In production, try to get the value from Azure Static Web Apps API
    if (import.meta.env.PROD) {
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(`API response for ${key}:`, data);
      return data[key] || "";
    }

    // In development, use Vite environment variables
    const value = import.meta.env[`VITE_${key}`];
    console.log(`Development value for ${key}:`, value);
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