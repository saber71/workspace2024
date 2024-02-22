var s = Object.defineProperty;
var u = (e, t, a) => t in e ? s(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var i = (e, t) => s(e, "name", { value: t, configurable: !0 });
var c = (e, t, a) => (u(e, typeof t != "symbol" ? t + "" : t, a), a);
const l = class l {
  constructor(t) {
    c(this, "_data");
    this.table = t;
  }
  async getAll() {
    return this._data || (this._data = (await this.table.toArray()).map((t) => t.value)), this._data;
  }
  async add(t) {
    return this._clearCache(), this.table.add({
      key: t.id,
      value: t
    });
  }
  async bulkAdd(...t) {
    return this._clearCache(), this.table.bulkAdd(
      t.map((a) => ({ key: a.id, value: a }))
    );
  }
  async delete(t) {
    return this._clearCache(), this.table.delete(t);
  }
  async bulkDelete(...t) {
    return this._clearCache(), this.table.bulkDelete(t);
  }
  async put(t) {
    return this._clearCache(), this.table.put({
      key: t.id,
      value: t
    });
  }
  async bulkPut(...t) {
    return this._clearCache(), this.table.bulkPut(
      t.map((a) => ({ key: a.id, value: a }))
    );
  }
  async getById(t) {
    var a;
    return (a = await this.table.get({ key: t })) == null ? void 0 : a.value;
  }
  async search(t) {
    return (await this.getAll()).filter(t);
  }
  async searchOne(t) {
    const a = await this.getAll();
    for (let r of a)
      if (t(r))
        return r;
  }
  _clearCache() {
    this._data = void 0;
  }
};
i(l, "IndexDBTable");
let h = l;
export {
  h as IndexDBTable
};
