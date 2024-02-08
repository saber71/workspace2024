var w = Object.defineProperty;
var f = (c, l) => w(c, "name", { value: l, configurable: !0 });
function M(c, l) {
  const p = {
    path: "/",
    children: []
  }, m = new RegExp("^" + l), d = /\.(ts|tsx)$/, j = /\.home/, h = /* @__PURE__ */ new Map(), R = Object.entries(c).map(([e, t]) => {
    e = e.replace(m, "");
    const r = e.split("/").filter((s) => !!s);
    return h.set(r, t), r;
  }).sort((e, t) => e.length === t.length ? e.join().localeCompare(t.join()) : e.length - t.length);
  for (let e of R)
    u(e, 0, p, []);
  return p;
  function u(e, t, r, s) {
    if (t >= e.length)
      return;
    let n = e[t];
    const g = d.test(n);
    if (g) {
      const i = j.test(n);
      n = n.split(".")[0], i && (p.redirect = "/" + [...s, n].join("/"));
    }
    let o = r.children.find((i) => i.path === n);
    if (!o) {
      if (o = {
        path: n,
        children: []
      }, g) {
        o.component = h.get(e);
        const i = n.split(/[.\-]/).map((a) => a[0].toUpperCase() + a.slice(1));
        o.name = i.join("");
      }
      r.children.push(o);
    }
    u(e, t + 1, o, [
      ...s,
      n
    ]);
  }
}
f(M, "autoRoutes");
export {
  M as autoRoutes
};
