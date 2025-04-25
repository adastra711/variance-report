// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // In production, try Azure Static Web Apps environment variables
  if (import.meta.env.PROD) {
    const value = import.meta.env[key];
    if (value) {
      console.log(`Found ${key} in production env:`, value);
      return value;
    }
  }

  // In development, try Vite environment variables
  const viteValue = import.meta.env[`VITE_${key}`];
  if (viteValue) {
    console.log(`Found ${key} in Vite env:`, viteValue);
    return viteValue;
  }

  console.log(`No value found for ${key}`);
  return "";
};

// Export configuration with fallback values for development
export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY'),
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT'),
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: "2024-02-15-preview"
  }
}; 