import { setupWorker } from 'msw/browser';
import { delay, http, HttpResponse } from 'msw';
import { Table } from '../types';

const mocks = [
  http.get('/api/tables', async () => {
    await delay(600);
    return HttpResponse.json({
      tables: [
        { name: 'fruites', rowCount: 4 },
        { name: 'vegetables', rowCount: 5 },
      ],
      totalRowCount: 9,
    } satisfies {
      tables: Table[];
      totalRowCount: number;
    });
  }),
];

export async function setupMocks() {
  const worker = setupWorker(...mocks);
  await worker.start({ onUnhandledRequest: 'bypass' });
}
