export type Backup = {
  name: string;
  lastModified: Date;
  totalRowCount: number;
  size: number;
  retentionPeriod: number;
};

export type Table = {
  name: string;
  rowCount: number;
};
