var i = Object.defineProperty;
var d = (e, a, t) => a in e ? i(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var c = (e, a) => i(e, "name", { value: a, configurable: !0 });
var h = (e, a, t) => (d(e, typeof a != "symbol" ? a + "" : a, t), t);
import { v4 as r } from "uuid";
const l = class l {
  constructor(a) {
    h(this, "_data");
    this.table = a;
  }
  async getAll() {
    return this._data || (this._data = (await this.table.toArray()).map((a) => a.value)), this._data;
  }
  async add(a) {
    return this._clearCache(), a.id || (a.id = r()), this.table.add({
      key: a.id,
      value: a
    });
  }
  async bulkAdd(...a) {
    return this._clearCache(), this.table.bulkAdd(
      a.map((t) => (t.id || (t.id = r()), { key: t.id, value: t }))
    );
  }
  async delete(a) {
    return this._clearCache(), this.table.delete(a);
  }
  async bulkDelete(...a) {
    return this._clearCache(), this.table.bulkDelete(a);
  }
  async put(a) {
    return this._clearCache(), a.id || (a.id = r()), this.table.put({
      key: a.id,
      value: a
    });
  }
  async bulkPut(...a) {
    return this._clearCache(), this.table.bulkPut(
      a.map((t) => (t.id || (t.id = r()), { key: t.id, value: t }))
    );
  }
  async getById(a) {
    var t;
    return (t = await this.table.get({ key: a })) == null ? void 0 : t.value;
  }
  async search(a) {
    return (await this.getAll()).filter(a);
  }
  async searchOne(a) {
    const t = await this.getAll();
    for (let s of t)
      if (a(s))
        return s;
  }
  _clearCache() {
    this._data = void 0;
  }
};
c(l, "IndexDBTable");
let u = l;
export {
  u as IndexDBTable
};
