// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // Try Vite environment variables first (for development)
  const viteValue = import.meta.env[`VITE_${key}`];
  if (viteValue) {
    console.log(`Found ${key} in Vite env:`, viteValue);
    return viteValue;
  }

  // Try direct environment variables (for Azure Static Web Apps)
  const envValue = import.meta.env[key];
  if (envValue) {
    console.log(`Found ${key} in env:`, envValue);
    return envValue;
  }

  console.log(`No value found for ${key}`);
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