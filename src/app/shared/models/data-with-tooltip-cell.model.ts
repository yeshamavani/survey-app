import {ICellRendererParams} from 'ag-grid-community';

export interface DataWithTooltipCell extends ICellRendererParams {
  count: string;
  value: string;
  firstValue: string;
}
