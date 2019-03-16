import React from 'react';
import { shallow } from 'enzyme';
import { RawNewWidget } from './index';

const props = {
    accounts: [
        {
            uuid: 'account1',
            provider: 'twitter',
            name: 'Test account'
        }
    ],
    widget: 'twitter_feed',
    onCreateWidget: jest.fn(),
    onClose: jest.fn(),
    open: true,
    intl: {
        formatMessage: jest.fn()
    }
};

it('Should render correctly at step 0', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly accounts list', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    wrapper.instance().onNextStep(1)();
    expect(wrapper.state('step')).toEqual(1);
    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly widget form', () => {
    const testProps = {
        ...props,
        widget: 'misc_rss'
    };
    const wrapper = shallow(<RawNewWidget {...testProps} />);

    wrapper.instance().onNextStep(2)();
    expect(wrapper.state('step')).toEqual(2);
    expect(wrapper).toMatchSnapshot();
});

it('Should correctly go back in step', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    wrapper.instance().onNextStep(1)();
    expect(wrapper.state('step')).toEqual(1);
    wrapper.instance().onPrevStep(0)();
    expect(wrapper.state('step')).toEqual(0);
});

it('Should correctly store config update', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    expect(wrapper.state('config')).toEqual({});
    wrapper.instance().onConfigUpdate({test: true});
    expect(wrapper.state('config')).toEqual({test: true});
});

it('Should not crash when an non-existing widget is given', () => {
    const testProps = {
        ...props,
        widget: 'non_existing'
    };
    const wrapper = shallow(<RawNewWidget {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should call parent function on creation', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    wrapper.instance().onTitleChange({
        target: {
            value: 'test title'
        }
    });
    wrapper.instance().onDisplayTitleChange({
        target: {
            checked: false
        }
    });
    wrapper.instance().onCreateWidget();

    expect(props.onCreateWidget).toHaveBeenCalledWith({
        title: 'test title',
        header: false,
        type: 'twitter_feed',
        accounts: [],
        config: {}
    });
});

it('Should correctly manage accounts', () => {
    const wrapper = shallow(<RawNewWidget {...props} />);

    expect(wrapper.state('accounts')).toEqual([]);
    wrapper.instance().addRemoveAccount('test', false)();
    expect(wrapper.state('accounts')).toEqual(['test']);
    wrapper.instance().addRemoveAccount('test2', true)();
    expect(wrapper.state('accounts')).toEqual(['test2', 'test']);
    wrapper.instance().addRemoveAccount('test', true)();
    expect(wrapper.state('accounts')).toEqual(['test2']);
    wrapper.instance().addRemoveAccount('final', false)();
    expect(wrapper.state('accounts')).toEqual(['final']);
});
