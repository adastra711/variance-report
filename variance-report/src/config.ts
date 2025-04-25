// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // In Azure Static Web Apps, environment variables are available directly
  const value = import.meta.env[`VITE_${key}`];
  console.log(`Checking VITE_${key}:`, value ? 'present' : 'missing');
  return value || "";
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