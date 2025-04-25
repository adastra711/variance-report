// Try to get configuration from Azure Static Web Apps configuration first
const getConfigValue = (key: string): string => {
  // First try Azure Static Web Apps configuration
  if (typeof window !== 'undefined') {
    const azureConfig = (window as any).__env__ || {};
    if (azureConfig[key]) {
      return azureConfig[key];
    }
  }
  
  // Fall back to Vite environment variables
  const envValue = import.meta.env[`VITE_${key}`];
  if (envValue) {
    return envValue;
  }

  // If we're in development, try without VITE_ prefix
  if (import.meta.env.DEV) {
    const devValue = import.meta.env[key];
    if (devValue) {
      return devValue;
    }
  }

  return "";
};

export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY'),
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT'),
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: "2024-02-15-preview"
  }
}; 