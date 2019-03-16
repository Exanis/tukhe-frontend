import React from 'react';
import { RawDashboard, styles } from './index';
import { shallow } from 'enzyme';

const props = {
    widgetActionWithAccount: jest.fn(),
    widgetActionWithoutAccount: jest.fn(),
    updateWidgetData: jest.fn(),
    addToWidgetData: jest.fn(),
    data: {
        "widget1": []
    },
    refreshWithAccount: jest.fn(),
    refreshWithoutAccount: jest.fn(),
    displayElementInPopup: jest.fn(),
    closeElementPopup: jest.fn(),
    updatePopupProps: jest.fn(),
    startWidgetProcess: jest.fn(),
    stopWidgetProcess: jest.fn(),
    onLayoutChange: jest.fn(),
    editable: false,
    widgets: [
        {
            uuid: "widget1",
            type: "twitter_feed",
            header: true,
            title: "Test feed"
        },
        {
            uuid: "widget2",
            type: "twitter_notifications",
            header: false,
            title: "Test notifications"
        }
    ],
    layout: {},
    classes: {}
};

it('Should render correctly with props', () => {
    const wrapper = shallow(<RawDashboard {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly without layout', () => {
    const testProps = {
        ...props,
        layout: null
    };
    const wrapper = shallow(<RawDashboard {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly in edit mode', () => {
    const testProps = {
        ...props,
        editable: true
    };
    const wrapper = shallow(<RawDashboard {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should correctly call parent methods', () => {
    const wrapper = shallow(<RawDashboard {...props} />);

    wrapper.instance().actionWithAccount('widget1')('act', ['test'], 'callback');
    expect(props.widgetActionWithAccount).toHaveBeenCalledWith({
        widget: 'widget1',
        action: 'act',
        params: ['test'],
        callback: 'callback'
    });
    wrapper.instance().actionWithoutAccount('widget1')('act', ['test'], 'callback');
    expect(props.widgetActionWithoutAccount).toHaveBeenCalledWith({
        widget: 'widget1',
        action: 'act',
        params: ['test'],
        callback: 'callback'
    });
    wrapper.instance().actionWithAccount('widget1')('act', ['test']);
    expect(props.widgetActionWithAccount).toHaveBeenCalledWith({
        widget: 'widget1',
        action: 'act',
        params: ['test'],
        callback: null
    });
    wrapper.instance().actionWithoutAccount('widget1')('act', ['test']);
    expect(props.widgetActionWithoutAccount).toHaveBeenCalledWith({
        widget: 'widget1',
        action: 'act',
        params: ['test'],
        callback: null
    });
    wrapper.instance().updateElement('widget1')('select', 'update');
    expect(props.updateWidgetData).toHaveBeenCalledWith({
        widget: 'widget1',
        select: 'select',
        update: 'update'
    });
    wrapper.instance().addElement('widget1')(['el1', 'el2']);
    expect(props.addToWidgetData).toHaveBeenCalledWith({
        widget: 'widget1',
        elements: ['el1', 'el2']
    });
    wrapper.instance().refreshWithAccount('widget1')();
    expect(props.refreshWithAccount).toHaveBeenCalledWith('widget1');
    wrapper.instance().refreshWithoutAccount('widget1')();
    expect(props.refreshWithoutAccount).toHaveBeenCalledWith('widget1');
    wrapper.instance().onLayoutChange({obj: 'test'});
    expect(props.onLayoutChange).toHaveBeenCalledWith({obj: 'test'});
});

it('Should keep styling consistent', () => {
    expect(styles()).toMatchSnapshot();
});

it('Should update state on actions change', () => {
    const wrapper = shallow(<RawDashboard {...props} />);

    expect(wrapper.state('widgetActions')).toEqual({});
    wrapper.instance().setWidgetActions('widget1')('test');
    expect(wrapper.state('widgetActions')).toEqual({
        widget1: 'test'
    });
});
