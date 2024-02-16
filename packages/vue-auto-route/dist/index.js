var P = Object.defineProperty;
var h = (r, f) => P(r, "name", { value: f, configurable: !0 });
async function x(r, f) {
  const l = {
    path: "/",
    children: []
  }, j = new RegExp("^" + f), w = /\.(ts|tsx)$/, R = /\.home/, p = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), m = [], y = Object.entries(r).map(([e, t]) => {
    e = e.replace(j, "");
    const i = e.split("/").filter((c) => !!c);
    return typeof t == "function" && (t = t()), t instanceof Promise ? m.push(
      t.then((c) => {
        p.set(i, c.default), a.set(i, c.Meta);
      })
    ) : (p.set(i, t.default), a.set(i, t.Meta)), i;
  }).sort((e, t) => e.length === t.length ? e.join().localeCompare(t.join()) : e.length - t.length);
  await Promise.all(m);
  for (let e of y)
    u(e, 0, l, []);
  return l;
  function u(e, t, i, c) {
    if (t >= e.length)
      return;
    let n = e[t];
    const g = w.test(n);
    if (g) {
      const s = R.test(n);
      n = n.split(".")[0], s && (l.redirect = "/" + [...c, n].join("/"));
    }
    let o = i.children.find((s) => s.path === n);
    if (!o) {
      if (o = {
        path: n,
        children: []
      }, g) {
        const s = p.get(e);
        if (o.component = s, o.meta = a.get(e), s != null && s.name)
          o.name = s.name;
        else {
          const C = n.split(/[.\-]/).map((M) => M[0].toUpperCase() + M.slice(1));
          o.name = C.join("");
        }
      }
      i.children.push(o);
    }
    u(e, t + 1, o, [
      ...c,
      n
    ]);
  }
}
h(x, "autoRoutes");
export {
  x as autoRoutes
};
