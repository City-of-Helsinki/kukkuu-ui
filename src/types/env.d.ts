declare global {
  interface Window {
    _env_?: Record<string, string | number | boolean | undefined>;
  }
}

export {};
