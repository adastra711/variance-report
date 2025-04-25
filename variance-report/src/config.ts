// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // Try both with and without VITE_ prefix
  const viteKey = `VITE_${key}`;
  const value = import.meta.env[viteKey] || import.meta.env[key];
  console.log(`Checking ${viteKey} and ${key}:`, value ? 'present' : 'missing');
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