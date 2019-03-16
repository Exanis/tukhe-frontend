import React from 'react';
import ConditionalComponent from './index';
import { shallow } from 'enzyme';

it('Should render when render is true', () => {
    const props = {
        render: true
    };
    const wrapper = shallow(<ConditionalComponent {...props}><div>Test</div></ConditionalComponent>);

    expect(wrapper).toMatchSnapshot();
});

it('Should not render when render is false', () => {
    const props = {
        render: false
    };
    const wrapper = shallow(<ConditionalComponent {...props}><div>Test</div></ConditionalComponent>);

    expect(wrapper).toMatchSnapshot();
});
