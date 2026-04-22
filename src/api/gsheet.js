const API_URL = "https://script.google.com/macros/s/AKfycbzllB5xxxk_OmL-jQr0lqKMZBDfEPEGhmffTUs_7y9Bd0rE6iC65PpTCP5cR7ymqrBnrw/exec";

async function gGet(params) {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

async function gPost(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export const db = {
  getJournals:    () => gGet({ action:"getAll", sheet:"journals" }),
  getAR:          () => gGet({ action:"getAll", sheet:"ar" }),
  getAP:          () => gGet({ action:"getAll", sheet:"ap" }),
  getInventory:   () => gGet({ action:"getAll", sheet:"inventory" }),
  getAccounts:    () => gGet({ action:"getAll", sheet:"accounts" }),
  getCustomers:   () => gGet({ action:"getAll", sheet:"customers" }),
  getSuppliers:   () => gGet({ action:"getAll", sheet:"suppliers" }),
  getCompany:     () => gGet({ action:"getCompany" }),
  getUsers:       () => gGet({ action:"getUsers" }),

  addJournal:     (data) => gPost({ action:"append", sheet:"journals", data }),
  addAR:          (data) => gPost({ action:"append", sheet:"ar", data }),
  addAP:          (data) => gPost({ action:"append", sheet:"ap", data }),
  addInventory:   (data) => gPost({ action:"append", sheet:"inventory", data }),
  addAccount:     (data) => gPost({ action:"append", sheet:"accounts", data }),
  addCustomer:    (data) => gPost({ action:"append", sheet:"customers", data }),
  addSupplier:    (data) => gPost({ action:"append", sheet:"suppliers", data }),

  updateAR:       (id, data) => gPost({ action:"update", sheet:"ar",        idField:"id",   idValue:id,   data }),
  updateAP:       (id, data) => gPost({ action:"update", sheet:"ap",        idField:"id",   idValue:id,   data }),
  updateInventory:(id, data) => gPost({ action:"update", sheet:"inventory", idField:"id",   idValue:id,   data }),
  updateCustomer: (id, data) => gPost({ action:"update", sheet:"customers", idField:"id",   idValue:id,   data }),
  updateSupplier: (id, data) => gPost({ action:"update", sheet:"suppliers", idField:"id",   idValue:id,   data }),
  setCompany:     (data)     => gPost({ action:"setCompany", data }),

  deleteJournal:  (id) => gPost({ action:"delete", sheet:"journals", idField:"id", idValue:id }),
  deleteAR:       (id) => gPost({ action:"delete", sheet:"ar",       idField:"id", idValue:id }),
  deleteAP:       (id) => gPost({ action:"delete", sheet:"ap",       idField:"id", idValue:id }),
  clearJournals:  ()   => gPost({ action:"clearAll", sheet:"journals" }),
};