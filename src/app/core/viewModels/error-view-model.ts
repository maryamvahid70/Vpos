export class ErrorViewModel{
  ErrorCode: string;
  ErrorMessage: string;
  constructor(init?: Partial<ErrorViewModel>){
      this.ErrorCode = init?.ErrorCode || '';
      this.ErrorMessage = init?.ErrorMessage || '';
  }
}