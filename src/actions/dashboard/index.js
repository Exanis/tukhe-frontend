import { createAction } from "redux-starter-kit";

export const loadDashboards = createAction('dashboard/load/list');
export const selectDashboard = createAction('dashboard/select');
export const createDashboard = createAction('dashboard/create');
export const updateDashboardLayout = createAction('dashboard/update/layout');

export const createWidget = createAction('widget/create');
export const refreshWidgetWithAccount = createAction('widget/refresh/account');
export const refreshWidgetWithoutAccount = createAction('widget/refresh/noAccount');
export const widgetActionWithAccount = createAction('widget/action/account');
export const widgetActionWithoutAccount = createAction('widget/action/noAccount');
export const startWidgetProcess = createAction('widget/process/start');
export const stopWidgetProcess = createAction('widget/process/stop');
