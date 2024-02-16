var C = Object.defineProperty;
var h = (r, f) => C(r, "name", { value: f, configurable: !0 });
async function d(r, f) {
  const l = {
    path: "/",
    children: []
  }, j = new RegExp("^" + f), w = /\.(ts|tsx)$/, R = /\.home/, p = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), u = [], y = Object.entries(r).map(([t, e]) => {
    t = t.replace(j, "");
    const o = t.split("/").filter((s) => !!s);
    return typeof e == "function" && (e = e()), e instanceof Promise ? u.push(
      e.then((s) => {
        p.set(o, s.default), a.set(o, s.Meta);
      })
    ) : (p.set(o, e.default), a.set(o, e.Meta)), o;
  }).sort((t, e) => t.length === e.length ? t.join().localeCompare(e.join()) : t.length - e.length);
  await Promise.all(u);
  for (let t of y)
    m(t, 0, l, []);
  return l;
  function m(t, e, o, s) {
    if (e >= t.length)
      return;
    let n = t[e];
    const g = w.test(n);
    if (g) {
      const c = R.test(n);
      n = n.split(".")[0], c && (l.redirect = "/" + [...s, n].join("/"));
    }
    let i = o.children.find((c) => c.path === n);
    if (!i) {
      if (i = {
        path: n,
        children: []
      }, g) {
        i.component = p.get(t), i.meta = a.get(t);
        const c = n.split(/[.\-]/).map((M) => M[0].toUpperCase() + M.slice(1));
        i.name = c.join("");
      }
      o.children.push(i);
    }
    m(t, e + 1, i, [
      ...s,
      n
    ]);
  }
}
h(d, "autoRoutes");
export {
  d as autoRoutes
};
