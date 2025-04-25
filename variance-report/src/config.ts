// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // Try direct environment variables first (for Azure Static Web Apps)
  const envValue = import.meta.env[key];
  if (envValue) {
    console.log(`Found ${key} in env:`, envValue);
    return envValue;
  }

  // Try Vite environment variables (for development)
  const viteValue = import.meta.env[`VITE_${key}`];
  if (viteValue) {
    console.log(`Found ${key} in Vite env:`, viteValue);
    return viteValue;
  }

  // Try Azure Static Web Apps configuration
  if (typeof window !== 'undefined') {
    const azureConfig = (window as any).__env__ || {};
    console.log('Azure Static Web Apps config:', azureConfig);
    if (azureConfig[key]) {
      console.log(`Found ${key} in Azure config:`, azureConfig[key]);
      return azureConfig[key];
    }
  }

  console.log(`No value found for ${key}`);
  return "";
};

// Export configuration with fallback values for development
export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY') || import.meta.env.VITE_AZURE_OPENAI_API_KEY || "",
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT') || import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "",
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT') || import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || "",
    apiVersion: "2024-02-15-preview"
  }
}; 