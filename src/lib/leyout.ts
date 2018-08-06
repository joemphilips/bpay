import bdb from 'bdb';

// tslint:disable object-literal-sort-keys
export const invoicedb = {
  prefix: bdb.key('t', ['uint32']),
  V: bdb.key('V')
};

export const tokendb = {
  V: bdb.key('V')
};
