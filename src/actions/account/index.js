import { createAction } from "redux-starter-kit";

export const loadAccounts = createAction('accounts/load/list');
export const deleteAccount = createAction('accounts/delete');

export const createTwitterAccount = createAction('accounts/create/Twitter');
