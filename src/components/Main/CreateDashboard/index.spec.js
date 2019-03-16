import React from 'react';
import { RawCreateDashboard } from './index';
import { shallow } from 'enzyme';

const props = {
    createDashboard: jest.fn(),
    open: true,
    onClose: jest.fn(),
    intl: {
        formatMessage: jest.fn()
    }
};

it('Should render create dashboard correctly', () => {
    const wrapper = shallow(<RawCreateDashboard {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should call parent function on dashboard creation', () => {
    const wrapper = shallow(<RawCreateDashboard {...props} />);

    wrapper.instance().onCreateDashboard('home')();
    expect(props.createDashboard).toHaveBeenCalledWith('home');
});
