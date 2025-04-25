// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // In Vite, environment variables MUST be prefixed with VITE_
  const viteKey = `VITE_${key}`;
  const value = import.meta.env[viteKey];
  console.log(`Checking ${viteKey}:`, {
    value: value ? 'present' : 'missing',
    allEnvKeys: Object.keys(import.meta.env).join(', ')
  });
  return value || "";
};

export const config = {
  azureOpenAI: {
    apiKey: getConfigValue('AZURE_OPENAI_API_KEY'),
    endpoint: getConfigValue('AZURE_OPENAI_ENDPOINT'),
    deployment: getConfigValue('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: "2024-02-15-preview"
  }
}; 