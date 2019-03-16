import React from 'react';
import { shallow } from 'enzyme';
import Auth from './index';

it('Should render as expected', () => {
    const wrapper = shallow(<Auth />);

    expect(wrapper).toMatchSnapshot();
});
