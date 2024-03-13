function removeHeadTailChar(str, char) {
    while(str[0] === char)str = str.slice(1);
    while(str[str.length - 1] === char)str = str.slice(0, str.length - 1);
    return str;
}

/* 组装url */ function composeUrl(...items) {
    return "/" + items.map((str)=>removeHeadTailChar(str, "/")).filter((str)=>str.length > 0).join("/");
}

export { composeUrl, removeHeadTailChar };
