export interface Message {
  type: string;
  from: string;
  to?: string;
  payload: any;
  timestamp: string;
}