export interface AppConfig {
  apiBaseUrl: string;
}

export let appConfig: AppConfig;

export async function loadConfig(): Promise<void> {
  const response = await fetch('assets/config.json');

  if (!response.ok) {
    throw new Error('Cannot load config.json');
  }

  appConfig = await response.json();
}