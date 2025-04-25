// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // Try Azure Static Web Apps configuration first
  if (typeof window !== 'undefined') {
    const azureConfig = (window as any).__env__ || {};
    console.log('Azure Static Web Apps config:', azureConfig);
    if (azureConfig[key]) {
      console.log(`Found ${key} in Azure config:`, azureConfig[key]);
      return azureConfig[key];
    }
  }

  // Try direct environment variables
  const envValue = import.meta.env[key];
  if (envValue) {
    console.log(`Found ${key} in env:`, envValue);
    return envValue;
  }

  // Try Vite environment variables
  const viteValue = import.meta.env[`VITE_${key}`];
  if (viteValue) {
    console.log(`Found ${key} in Vite env:`, viteValue);
    return viteValue;
  }

  console.log(`No value found for ${key}`);
  return "";
};

// Export configuration with fallback values
export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY'),
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT'),
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: "2024-02-15-preview"
  }
}; 
}; 