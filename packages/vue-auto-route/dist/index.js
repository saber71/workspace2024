var y = Object.defineProperty;
var h = (c, l) => y(c, "name", { value: l, configurable: !0 });
async function M(c, l) {
  const f = {
    path: "/",
    children: []
  }, j = new RegExp("^" + l), R = /\.(ts|tsx)$/, w = /\.home/, p = /* @__PURE__ */ new Map(), u = [], d = Object.entries(c).map(([t, e]) => {
    t = t.replace(j, "");
    const o = t.split("/").filter((i) => !!i);
    return typeof e == "function" && (e = e()), e instanceof Promise ? u.push(
      e.then((i) => p.set(o, i.default))
    ) : p.set(o, e.default), o;
  }).sort((t, e) => t.length === e.length ? t.join().localeCompare(e.join()) : t.length - e.length);
  await Promise.all(u);
  for (let t of d)
    a(t, 0, f, []);
  return f;
  function a(t, e, o, i) {
    if (e >= t.length)
      return;
    let n = t[e];
    const m = R.test(n);
    if (m) {
      const r = w.test(n);
      n = n.split(".")[0], r && (f.redirect = "/" + [...i, n].join("/"));
    }
    let s = o.children.find((r) => r.path === n);
    if (!s) {
      if (s = {
        path: n,
        children: []
      }, m) {
        s.component = p.get(t);
        const r = n.split(/[.\-]/).map((g) => g[0].toUpperCase() + g.slice(1));
        s.name = r.join("");
      }
      o.children.push(s);
    }
    a(t, e + 1, s, [
      ...i,
      n
    ]);
  }
}
h(M, "autoRoutes");
export {
  M as autoRoutes
};
