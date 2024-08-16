import '../mocks/browser';

export const environment = {
  apiContextPath: '/api',
};

export async function bootstrapEnvironment() {
  const { setupMocks } = await import('../mocks/browser');
  await setupMocks();
}
