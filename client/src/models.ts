export type Backup = {
  name: string;
  lastModified: string;
  totalRowCount: number;
  size: number;
  retentionPeriod: number;
};

export type Table = {
  name: string;
  rowCount: number;
};
