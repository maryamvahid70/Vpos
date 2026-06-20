import { TableMainActions } from "./table-main-actions";
import { ITableActionConfig } from "../interfaces/table-action-config.interface";
export type TableMainActionsConfig<T> = Partial<Record<TableMainActions, ITableActionConfig<T>>>;
