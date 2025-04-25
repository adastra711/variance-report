// Configuration values for Azure OpenAI
const getConfigValue = (key: string): string => {
  // Try different environment variable patterns
  const patterns = [
    `REACT_APP_${key}`,  // React apps in production
    key,                 // Direct Azure portal name
    `VITE_${key}`       // Local development
  ];

  for (const pattern of patterns) {
    const value = import.meta.env[pattern];
    if (value) {
      console.log(`Found value for ${key} using pattern ${pattern}`);
      return value;
    }
  }

  console.log(`No value found for ${key} after trying patterns:`, patterns);
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