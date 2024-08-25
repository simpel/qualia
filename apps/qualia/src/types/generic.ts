type TStatusTypes =
  | 'normal'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'
  | 'default';

export interface IStatus {
  status: TStatusTypes;
  message: string;
}
