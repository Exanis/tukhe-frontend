import React from 'react';
import { classes, RawRss } from './rss';
import { shallow } from 'enzyme';

const props = {
    data: [
        {
            id: 'rss1',
            href: 'http://example.org',
            title: 'RSS First element',
            date: '2019-01-01 01:01:01'
        }
    ],
    containerClass: 'aClass',
    startWidgetProcess: jest.fn(),
    stopWidgetProcess: jest.fn(),
    refreshWithoutAccount: jest.fn(),
    uuid: 'widget uuid',
    classes: {},
    intl: {
        formatDate: jest.fn()
    }
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawRss {...props} />);

    expect(wrapper).toMatchSnapshot();
    expect(props.startWidgetProcess).toHaveBeenCalledWith({
        target: props.refreshWithoutAccount,
        interval: 300000,
        widget: 'widget uuid'
    });
    wrapper.unmount();
    expect(props.stopWidgetProcess).toHaveBeenCalledWith({
        widget: 'widget uuid'
    });
});

it('Should be able to change page', () => {
    const wrapper = shallow(<RawRss {...props} />);

    expect(wrapper.state('displayPages')).toEqual(0);
    wrapper.instance().pseudoLoadData(2);
    expect(wrapper.state('displayPages')).toEqual(2);
});

it('Should not crash without data', () => {
    const testProps = {
        ...props,
        data: null
    };
    const wrapper = shallow(<RawRss {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should keep theme consistant', () => {
    const theme = {
        palette: {
            primary: {
                main: '#000',
                light: '#aaa'
            }
        }
    };
    const style = classes(theme);

    expect(style).toMatchSnapshot();
});
