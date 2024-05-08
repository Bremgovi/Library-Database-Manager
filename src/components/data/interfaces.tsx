interface Column {
  key: string;
  label: string;
  type: any;
  length?: number;
}

interface IdColumns {
  foreignTable: string;
  idColumn: string;
  columns: string[];
}

interface RadioColumns {
  foreignTable: string;
  idColumn: string;
  descriptionColumn: string;
}

interface RowData {
  [key: string]: any;
}

interface TableProps {
  table: string;
  endpoint: string;
  idColumns?: IdColumns[];
  radioColumns?: RadioColumns[];
  unchangeableColumn?: string;
  checkColumns?: RadioColumns[];
}

export type { Column, IdColumns, RowData, TableProps };
