import React from 'react';
import { shallow } from 'enzyme';
import {
    DisconnectedProtectedRoute,
    DisconnectedUnprotectedRoute,
    RawApp,
    mapStateToProps,
    styles
} from "./index";

const pageProps = {
    user: {
        token: '123'
    },
    Page: () => <div>test</div>,
    location: {
        href: 'test'
    }
};

it('Should render routes as expected when logged in', () => {
    const unprotectedWrapper = shallow(<DisconnectedUnprotectedRoute {...pageProps} />);
    const protectedWrapper = shallow(<DisconnectedProtectedRoute {...pageProps} />);

    expect(unprotectedWrapper).toMatchSnapshot();
    expect(protectedWrapper).toMatchSnapshot();
});

it('Should render routes as expected when not logged in', () => {
    const testProps = {
        ...pageProps,
        user: {
            token: null
        }
    };
    const unprotectedWrapper = shallow(<DisconnectedUnprotectedRoute {...testProps} />);
    const protectedWrapper = shallow(<DisconnectedProtectedRoute {...testProps} />);

    expect(unprotectedWrapper).toMatchSnapshot();
    expect(protectedWrapper).toMatchSnapshot();
});

it('Should render theme and state as expected', () => {
    const state = {
        user: 'test'
    };
    const theme = {};

    expect(mapStateToProps(state)).toMatchSnapshot();
    expect(styles(theme)).toMatchSnapshot();
});

it('Should render app as expected', () => {
    const baseProps = {
        classes: {},
        user: {
            token: 'test'
        },
        sessionLogin: jest.fn()
    };
    const unauthProps = {
        ...baseProps,
        user: {
            token: false
        }
    };
    const wrapperAfterAuth = shallow(<RawApp {...baseProps} />);
    const wrapperBeforeAuth = shallow(<RawApp {...unauthProps} />);

    expect(wrapperAfterAuth).toMatchSnapshot();
    expect(wrapperBeforeAuth).toMatchSnapshot();
    expect(baseProps.sessionLogin).toHaveBeenCalled();
});
