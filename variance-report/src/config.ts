export const config = {
  azureOpenAI: {
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || "",
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "",
    deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || "",
    apiVersion: "2024-02-15-preview"
  }
}; 