import React from 'react';
import { IntlProvider } from 'react-intl';
import BasicPopup, { RawDialogTitle, DialogTitle, DialogContent, DialogActions } from './index';
import { shallow, render } from 'enzyme';

it('Should render correctly with all props', () => {
    const props = {
        title: 'Test title',
        onClose: jest.fn(),
        actions: [<div key="1">Test div</div>],
        additionalProp: {}
    };
    const wrapper = shallow(<BasicPopup {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly without title', () => {
    const props = {
        actions: [<div key="1">Test div</div>],
    };
    const wrapper = shallow(<BasicPopup {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly without actions', () => {
    const props = {
        title: 'Test title',
        onClose: jest.fn(),
    };
    const wrapper = shallow(<BasicPopup {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render title correctly with close button', () => {
    const props = {
        onClose: jest.fn(),
        classes: {},
        intl: {
            formatMessage: jest.fn()
        }
    };
    const wrapper = render(<RawDialogTitle {...props}><div>Test</div></RawDialogTitle>);

    expect(wrapper).toMatchSnapshot();
});

it('Should render title correctly without close button', () => {
    const props = {
        classes: {},
        intl: {
            formatMessage: jest.fn()
        }
    };
    const wrapper = render(<RawDialogTitle {...props}><div>Test</div></RawDialogTitle>);

    expect(wrapper).toMatchSnapshot();
});

it('Should render popup title as expected', () => {
    const wrapperTitle = render(<IntlProvider locale="en"><DialogTitle /></IntlProvider>);

    expect(wrapperTitle).toMatchSnapshot();
});

it('Should render popup content as expected', () => {
    const wrapperContent = render(<IntlProvider locale="en"><DialogContent /></IntlProvider>);

    expect(wrapperContent).toMatchSnapshot();
});

it('Should render popup actions as expected', () => {
    const wrapperActions = render(<IntlProvider locale="en"><DialogActions /></IntlProvider>);

    expect(wrapperActions).toMatchSnapshot();
});
