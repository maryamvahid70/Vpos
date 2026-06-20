
export interface ITableActionConfig<T> {
  title?: string;
  icon?: string;
  type?: 'text' | 'iconic';
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  buttonColor?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  buttonColorType?: 'outline' | 'highlight';
  leftIcon?: boolean;
  order?:number
  action: (customAction: T) => void;
}