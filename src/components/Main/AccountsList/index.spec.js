import React from 'react';
import { RawAccountsList } from "./index";
import { shallow } from 'enzyme';

const props = {
    accounts: [
        {
            uuid: 'test1',
            provider: 'twitter',
            name: 'account1'
        },
        {
            uuid: 'test2',
            provider: 'facebook',
            name: 'account2'
        }
    ],
    onDeleteAccount: jest.fn(),
    providers: {
        'twitter': jest.fn(),
        'facebook': jest.fn()
    },
    onClose: jest.fn(),
    open: true,
    intl: {
        formatMessage: jest.fn()
    }
};

it('Should render as expected with all props', () => {
    const wrapper = shallow(<RawAccountsList {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should call provider on menu action', () => {
    const wrapper = shallow(<RawAccountsList {...props} />);

    wrapper.instance().menuAction('twitter')();
    expect(props.providers.twitter).toHaveBeenCalled();
});

it('Should delete account from parent', () => {
    const wrapper = shallow(<RawAccountsList {...props} />);

    wrapper.instance().deleteAccount(props.accounts[0])();
    expect(props.onDeleteAccount).toHaveBeenCalledWith('test1');
});

it('Should have a functionnal menu', () => {
    const wrapper = shallow(<RawAccountsList {...props} />);

    expect(wrapper.state('anchorEl')).toBeNull();
    wrapper.instance().onOpenMenu({currentTarget: 'test'});
    expect(wrapper.state('anchorEl')).toEqual('test');
    wrapper.instance().onCloseMenu();
    expect(wrapper.state('anchorEl')).toBeNull();
});
