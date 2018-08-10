import { key } from 'bdb';

// tslint:disable object-literal-sort-keys
export const invoicedb = {
  prefix: key('t', ['uint32']),
  V: key('V')
};

export const tokendb = {
  V: key('V')
};
