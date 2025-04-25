// Try to get configuration from Azure Static Web Apps configuration first
const getConfigValue = (key: string): string => {
  // First try Azure Static Web Apps configuration
  const azureConfig = (window as any).__env__ || {};
  if (azureConfig[key]) {
    return azureConfig[key];
  }
  
  // Fall back to Vite environment variables
  return import.meta.env[`VITE_${key}`] || "";
};

export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY'),
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT'),
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: "2024-02-15-preview"
  }
}; 