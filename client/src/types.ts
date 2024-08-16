export type Table = {
  name: string;
  rowCount: number;
};

export type Backup = {
  name: string;
  lastModified: Date;
  totalRowCount: number;
  size: number;
  retentionPeriod: number;
};
