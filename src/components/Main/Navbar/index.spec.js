import React from 'react';
import Navbar from './index';
import { shallow } from 'enzyme';

const props = {
    selectDashboard: jest.fn(),
    dashboards: [
        {
            uuid: 'dashboard1',
            icon: 'home'
        },
        {
            uuid: 'dashboard2',
            icon: 'money'
        }
    ],
    current: 'dashboard1',
    editable: false,
    onSaveLayout: jest.fn(),
    onAddWidget: jest.fn(),
    onUnlock: jest.fn(),
    createDashboard: jest.fn(),
    onAccount: jest.fn(),
    onLogout: jest.fn()
};

it('Should render correctly with props', () => {
    const wrapper = shallow(<Navbar {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly when in edit mode', () => {
    const testProps = {
        ...props,
        editable: true
    };
    const wrapper = shallow(<Navbar {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should call parent methods on dashboard selection', () => {
    const wrapper = shallow(<Navbar {...props} />);

    wrapper.instance().onSelectDashboard(props.dashboards[1])();
    expect(props.selectDashboard).toHaveBeenCalledWith('dashboard2');
});

it('Should have a working menu', () => {
    const wrapper = shallow(<Navbar {...props} />);
    const action = jest.fn();

    expect(wrapper.state('anchorEl')).toBeNull();
    wrapper.instance().onOpenMenu({
        currentTarget: 'test'
    });
    expect(wrapper.state('anchorEl')).toEqual('test');
    wrapper.instance().menuAction(action)();
    expect(action).toHaveBeenCalled();
    expect(wrapper.state('anchorEl')).toBeNull();
});
