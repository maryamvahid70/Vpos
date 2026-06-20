export interface ITableExtraColumns<T>{
    key: string;
    title: string;
    type: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
    disabled: boolean;
    action: (customAction: T) => void;
}