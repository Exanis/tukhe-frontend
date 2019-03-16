import React from 'react';
import { shallow } from 'enzyme';
import { RawCatalog } from './index';

const props = {
    widgets: {
        'twitter': [
            'feed',
            'notifications'
        ],
        'misc': [
            'rss'
        ]
    },
    onSelectWidget: jest.fn(),
    onClose: jest.fn(),
    open: true,
    intl: {
        formatMessage: jest.fn()
    }
};

it('Should render catalog as expected', () => {
    const wrapper = shallow(<RawCatalog {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should call parent selection on widget selection', () => {
    const wrapper = shallow(<RawCatalog {...props} />);

    expect(wrapper.state('currentTab')).toEqual(0);
    wrapper.instance().onTabChange(1, 1);
    expect(wrapper.state('currentTab')).toEqual(1);
    wrapper.instance().onSelectWidget(['twitter', 'misc'], 'rss')();
    expect(props.onSelectWidget).toHaveBeenCalledWith('misc', 'rss');
});
