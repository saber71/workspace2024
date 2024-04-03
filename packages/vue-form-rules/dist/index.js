import validator from 'validator';

///<reference types="../types.d.ts"/>
const Required = {
    required: true,
    validator: (_, value)=>{
        if (!value) return Promise.reject("此为必填项");
        return Promise.resolve();
    }
};
const ValidEmail = {
    validator (_, value) {
        if (!validator.isEmail(value)) return Promise.reject("不是合法的邮箱");
        else return Promise.resolve();
    }
};
const Equal = (targetValue, errMessage = "不一致")=>{
    return {
        validator (_, value) {
            return value === (typeof targetValue !== "function" ? targetValue : targetValue()) ? Promise.resolve() : Promise.reject(errMessage);
        }
    };
};

export { Equal, Required, ValidEmail };
