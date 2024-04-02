import { Validation } from "server";

export class CreateLogDTO {
  @Validation({ validatorType: "isLength", arg: { min: 1 } })
  creator: string;

  @Validation({ validatorType: "isString" })
  description: string;
  data?: any;
  body?: any;
  query?: any;

  @Validation({ validatorType: "isString" })
  url: string;
}