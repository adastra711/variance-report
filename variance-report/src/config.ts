// Configuration values for Azure OpenAI
declare global {
  interface Window {
    __STATIC_CONTENT?: {
      AZURE_OPENAI_API_KEY?: string;
      AZURE_OPENAI_ENDPOINT?: string;
      AZURE_OPENAI_DEPLOYMENT?: string;
    };
  }
}

export async function getConfigValue(key: string): Promise<string | undefined> {
  try {
    const response = await fetch(`/api/config`);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    const config = await response.json();
    return config[key];
  } catch (error) {
    console.error(`Error fetching config for key ${key}:`, error);
    // Fallback to environment variables
    return import.meta.env[`VITE_${key.toUpperCase()}`];
  }
}

const getConfigValueSync = (key: string): string | undefined => {
  // In production, get from Static Web Apps runtime config
  if (import.meta.env.PROD && window.__STATIC_CONTENT) {
    const value = window.__STATIC_CONTENT[key as keyof typeof window.__STATIC_CONTENT];
    console.log(`Production value for ${key}:`, value ? 'present' : 'missing');
    return value || undefined;
  }

  // In development, use Vite environment variables
  const value = import.meta.env[`VITE_${key}`];
  console.log(`Development value for ${key}:`, value || 'not found');
  return value || undefined;
};

export const config = {
  azureOpenAI: {
    get apiKey(): string | undefined {
      return getConfigValue('AZURE_OPENAI_API_KEY') || undefined;
    },
    get endpoint(): string | undefined {
      return getConfigValue('AZURE_OPENAI_ENDPOINT') || undefined;
    },
    get deployment(): string | undefined {
      return getConfigValue('AZURE_OPENAI_DEPLOYMENT') || undefined;
    },
    apiVersion: "2024-02-15-preview"
  }
}; 