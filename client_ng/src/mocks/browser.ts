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
  http.post('/api/cleanup', async () => {
    await delay(400);
    return HttpResponse.json(null);
  }),
  http.post('/api/backup', async () => {
    await delay(200);
    return HttpResponse.json(null);
  }),
  http.post('/api/restore/:backupName', async () => {
    await delay(200);
    return HttpResponse.json(null);
  }),
  http.get('/api/backups', async () => {
    await delay(200);
    return HttpResponse.json([
      {
        name: 'backup1',
        lastModified: new Date().toISOString(),
        totalRowCount: 4,
        size: 1000,
        retentionPeriod: 7,
      },
      {
        name: 'backup2',
        lastModified: new Date().toISOString(),
        totalRowCount: 5,
        size: 2000,
        retentionPeriod: 14,
      },
    ]);
  }),
];

export async function setupMocks() {
  const worker = setupWorker(...mocks);
  await worker.start({ onUnhandledRequest: 'bypass' });
}
