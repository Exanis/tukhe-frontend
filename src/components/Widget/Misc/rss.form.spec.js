import React from 'react';
import { RawRssForm } from './rss.form';
import { shallow } from 'enzyme';

const props = {
    config: {},
    onConfigUpdate: jest.fn(),
    intl: {
        formatMessage: jest.fn()
    }
};

it('Should render as expected', () => {
    const wrapper = shallow(<RawRssForm {...props} />);

    expect(wrapper).toMatchSnapshot();
    expect(props.onConfigUpdate).toHaveBeenCalledWith({
        url: ''
    });
});

it('Should update config on field change', () => {
    const wrapper = shallow(<RawRssForm {...props} />);

    wrapper.instance().onUrlChange({
        target: {
            value: 'url'
        }
    });
    expect(props.onConfigUpdate).toHaveBeenCalledWith({
        url: 'url'
    });
});
