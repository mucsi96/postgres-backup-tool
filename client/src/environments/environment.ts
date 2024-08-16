declare global {
  interface Window {
    __env: {
      apiContextPath: string;
    };
  }
}

export const environment: {
  apiContextPath: string;
} = {
  apiContextPath: window.__env.apiContextPath,
};

export async function bootstrapEnvironment() {}
