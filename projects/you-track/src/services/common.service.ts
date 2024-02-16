import { Service } from "vue-class";

@Service({ singleton: true, createOnLoad: true })
export class CommonService {
  /* 检查入参是否是合法的邮件地址 */
  isEmail(value: string) {
    return /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/.test(
      value,
    );
  }
}
