import React from 'react';
import { shallow } from 'enzyme';
import { styles, mapStateToProps, Main } from './index';

const props = {
    'setToken': jest.fn(),
    'updateWidgetData': jest.fn(),
    'addToWidgetData': jest.fn(),
    loadDashboards: jest.fn(),
    createDashboard: jest.fn(),
    selectDashboard: jest.fn(),
    loadAccounts: jest.fn(),
    deleteAccount: jest.fn(),
    createTwitterAccount: jest.fn(),
    createWidget: jest.fn(),
    updateDashboardLayout: jest.fn(),
    refreshWidgetWithoutAccount: jest.fn(),
    refreshWidgetWithAccount: jest.fn(),
    widgetActionWithAccount: jest.fn(),
    widgetActionWithoutAccount: jest.fn(),
    startWidgetProcess: jest.fn(),
    stopWidgetProcess: jest.fn(),
    dashboard: {
        currentDashboard: 'test',
        dashboards: [{
            uuid: 'test',
            layout: {},
            icon: 'home'
        },],
        widgets: [],
        data: {}
    },
    account: {
        accounts: []
    },
    classes: {}
};
const wrapper = shallow(<Main {...props} />);

it('Should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.loadDashboards).toHaveBeenCalled();
    expect(props.loadAccounts).toHaveBeenCalled();
    wrapper.setProps({
        account: {
            accounts: [],
            token: 'test'
        }
    });
    expect(wrapper).toMatchSnapshot();
});

it('Should manage popup correctly', () => {
    wrapper.instance().displayElementInPopup('test');
    expect(wrapper.state('popupDisplayElement')).toEqual('test');
    wrapper.instance().displayElementInPopup('test2', 'props');
    expect(wrapper.state('popupDisplayElement')).toEqual('test2');
    expect(wrapper.state('popupProps')).toEqual('props');
    wrapper.instance().closeElementPopup();
    expect(wrapper.state('popupDisplayElement')).toBeNull();
    expect(wrapper.state('popupProps')).toEqual({});
    wrapper.instance().updatePopupProps({
        'data1': 'test',
        'data2': 'other test'
    });
    wrapper.instance().updatePopupProps({
        'data1': 'something',
        'data3': 'else'
    });
    expect(wrapper.state('popupProps')).toEqual({
        'data1': 'something',
        'data2': 'other test',
        'data3': 'else'
    })
});

it('Should manage dashboard correctly', () => {
    wrapper.instance().openCreateDashboard();
    expect(wrapper.state('displayCreateDashboard')).toBeTruthy();
    wrapper.instance().createDashboard('test');
    expect(props.createDashboard).toHaveBeenCalledWith('test');
    expect(wrapper.state('displayCreateDashboard')).toBeFalsy();
    wrapper.instance().openCreateDashboard();
    wrapper.instance().onCloseCreateDashboard();
    expect(wrapper.state('displayCreateDashboard')).toBeFalsy();
    wrapper.instance().unlockDashboard();
    expect(wrapper.state('editable')).toBeTruthy();
    wrapper.instance().onLayoutChange({'test': 'test'});
    expect(wrapper.state('layout')).toEqual({'test': 'test'});
    wrapper.instance().onSaveDashboardLayout();
    expect(wrapper.state('editable')).toBeFalsy();
    expect(props.updateDashboardLayout).toHaveBeenCalledWith({'test': 'test'});
    wrapper.instance().onLayoutChange({'test': 'test2'});
    expect(wrapper.state('layout')).toEqual({'test': 'test'});
    wrapper.instance().refreshLayoutState({'test': 'new test'})();
    expect(wrapper.state('layout')).toEqual({'test': 'new test'});
});

it('Should manage widget correctly', () => {
    wrapper.instance().onAddWidget();
    expect(wrapper.state('displayCatalog')).toBeTruthy();
    wrapper.instance().onCloseCatalog();
    expect(wrapper.state('displayCatalog')).toBeFalsy();
    wrapper.instance().onAddWidget();
    wrapper.instance().createWidget('provider', 'widget');
    expect(wrapper.state('displayCatalog')).toBeFalsy();
    expect(wrapper.state('createWidgetTarget')).toEqual('provider_widget');
    expect(wrapper.state('displayCreateWidget')).toBeTruthy();
    wrapper.instance().onCreateWidget('test');
    expect(wrapper.state('displayCreateWidget')).toBeFalsy();
    expect(props.createWidget).toHaveBeenCalledWith('test');
    wrapper.instance().createWidget('provider', 'widget');
    wrapper.instance().onCloseNewWidget();
    expect(wrapper.state('displayCreateWidget')).toBeFalsy();
});

it('Should log out', () => {
    wrapper.instance().onLogout();
    expect(props.setToken).toHaveBeenCalledWith(null);
});

it('Should manage account', () => {
    wrapper.instance().onAccount();
    expect(wrapper.state('displayAccountList')).toBeTruthy();
    wrapper.instance().onCloseAccountList();
    expect(wrapper.state('displayAccountList')).toBeFalsy();
});

it('Should keep helper func coherent', () => {
    expect(styles()).toMatchSnapshot();
    expect(mapStateToProps({
        dashboard: 'dashboard',
        account: {
            accounts: [
                'test'
            ]
        }
    })).toMatchSnapshot();
});
