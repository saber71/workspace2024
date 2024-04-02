import deepEqual from 'deep-equal';

///<reference types="../types.d.ts"/>
function matchFilterCondition(data, condition) {
    const filterPredicates = parseFilterCondition(condition);
    return filterPredicates.every((fn)=>fn(data));
}
function parseFilterCondition(condition) {
    if (!condition) return [];
    const filterPredicates = [];
    for(let keyOrPropName in condition){
        const conditionValue = condition[keyOrPropName];
        if (keyOrPropName === "$or" || keyOrPropName === "$nor") {
            const filterConditions = conditionValue;
            const conditions = filterConditions.map(parseFilterCondition);
            if (keyOrPropName === "$or") {
                filterPredicates.push((item)=>{
                    for (let fnArray of conditions){
                        if (fnArray.every((fn)=>fn(item))) return true;
                    }
                    return false;
                });
            } else {
                filterPredicates.push((item)=>{
                    for (let fnArray of conditions){
                        if (fnArray.every((fn)=>fn(item))) return false;
                    }
                    return true;
                });
            }
        } else {
            if (isCondition(conditionValue)) {
                parseCondition(keyOrPropName, conditionValue, filterPredicates);
            } else {
                if (typeof conditionValue === "object" && conditionValue) {
                    const subFilterPredicates = parseFilterCondition(conditionValue);
                    filterPredicates.push((item)=>{
                        if (item[keyOrPropName] === undefined || item[keyOrPropName] === null) return false;
                        return subFilterPredicates.every((fn)=>fn(item[keyOrPropName]));
                    });
                } else filterPredicates.push((item)=>item[keyOrPropName] === conditionValue);
            }
        }
    }
    return filterPredicates;
}
function parseCondition(propName, condition, filterPredicates) {
    for(let conditionKey in condition){
        let conditionValue = condition[conditionKey];
        if (conditionValue === undefined) continue;
        if (conditionKey === "$less") filterPredicates.push((item)=>item[propName] < conditionValue);
        else if (conditionKey === "$greater") filterPredicates.push((item)=>item[propName] > conditionValue);
        else if (conditionKey === "$lessEqual") filterPredicates.push((item)=>item[propName] <= conditionValue);
        else if (conditionKey === "$greaterEqual") filterPredicates.push((item)=>item[propName] >= conditionValue);
        else if (conditionKey === "$not") filterPredicates.push((item)=>!deepEqual(item[propName], conditionValue, {
                strict: true
            }));
        else if (conditionKey === "$equal") filterPredicates.push((item)=>deepEqual(item[propName], conditionValue, {
                strict: true
            }));
        else if (conditionKey === "$dateBefore") {
            if (conditionValue instanceof Date) conditionValue = conditionValue.getTime();
            filterPredicates.push((item)=>{
                let value = item[propName];
                if (value instanceof Date) value = value.getTime();
                else if (typeof value === "string") value = new Date(value).getTime();
                return value < conditionValue;
            });
        } else if (conditionKey === "$dateAfter") {
            if (conditionValue instanceof Date) conditionValue = conditionValue.getTime();
            filterPredicates.push((item)=>{
                let value = item[propName];
                if (value instanceof Date) value = value.getTime();
                else if (typeof value === "string") value = new Date(value).getTime();
                return value > conditionValue;
            });
        } else if (conditionKey === "$or") {
            const conditions = [];
            conditionValue.forEach((condition)=>parseCondition(propName, condition, conditions));
            filterPredicates.push((item)=>{
                for (let predicate of conditions){
                    if (predicate(item)) return true;
                }
                return false;
            });
        } else if (conditionKey === "$nor") {
            const conditions = [];
            conditionValue.forEach((condition)=>parseCondition(propName, condition, conditions));
            filterPredicates.push((item)=>{
                for (let predicate of conditions){
                    if (predicate(item)) return false;
                }
                return true;
            });
        } else if (conditionKey === "$in") {
            filterPredicates.push((item)=>includes(conditionValue, item[propName]));
        } else if (conditionKey === "$notIn") {
            filterPredicates.push((item)=>!includes(conditionValue, item[propName]));
        } else if (conditionKey === "$contains") {
            filterPredicates.push((item)=>{
                const value = item[propName];
                if (value instanceof Array) {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (!includes(value, cond)) return false;
                        }
                        return true;
                    } else return includes(value, conditionValue);
                } else if (typeof value === "string") {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (!includes(value, cond)) return false;
                        }
                        return true;
                    } else return includes(value, conditionValue);
                }
                return false;
            });
        } else if (conditionKey === "$notContains") {
            filterPredicates.push((item)=>{
                const value = item[propName];
                if (value instanceof Array) {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (includes(value, cond)) return false;
                        }
                        return true;
                    } else return !includes(value, conditionValue);
                } else if (typeof value === "string") {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (includes(value, cond)) return false;
                        }
                        return true;
                    } else return !includes(value, conditionValue);
                }
                return false;
            });
        } else if (conditionKey === "$match") {
            if (typeof conditionValue === "string") conditionValue = new RegExp(conditionValue);
            filterPredicates.push((item)=>conditionValue.test(item[propName]));
        }
    }
}
function isCondition(arg) {
    if (!arg || typeof arg !== "object") return false;
    const keys = [
        "$less",
        "$lessEqual",
        "greater",
        "$greaterEqual",
        "$equal",
        "$not",
        "$dateBefore",
        "$dateAfter",
        "$or",
        "$nor",
        "$in",
        "$notIn",
        "$contains",
        "$notContains",
        "$match"
    ];
    for (let key of keys){
        if (key in arg) return true;
    }
    return false;
}
function includes(arr, value) {
    if (typeof arr === "string") return arr.includes(value);
    else return arr.find((item)=>deepEqual(item, value, {
            strict: true
        }));
}
function sortData(array, sortOrders) {
    const sortPredicates = sortOrders.map((item)=>{
        if (item.order === "asc") return (a, b)=>a[item.field] - b[item.field];
        else return (a, b)=>b[item.field] - a[item.field];
    });
    array.sort((a, b)=>{
        for (let sortPredicate of sortPredicates){
            const value = sortPredicate(a, b);
            if (value) return value;
        }
        return 0;
    });
}

export { matchFilterCondition, parseFilterCondition, sortData };
