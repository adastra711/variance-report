// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // In Azure Static Web Apps, environment variables are available directly
  if (import.meta.env.PROD) {
    // In production, try Azure Static Web Apps environment variables
    const value = import.meta.env[key];
    if (value) {
      console.log(`Found ${key} in production env:`, value);
      return value;
    }
  }

  // In development, try Vite environment variables
  const envValue = import.meta.env[`VITE_${key}`];
  if (envValue) {
    console.log(`Found ${key} in Vite env:`, envValue);
    return envValue;
  }

  // If we're in development, try without VITE_ prefix
  if (import.meta.env.DEV) {
    const devValue = import.meta.env[key];
    if (devValue) {
      console.log(`Found ${key} in dev env:`, devValue);
      return devValue;
    }
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