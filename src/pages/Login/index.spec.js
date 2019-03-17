import React from 'react';
import { shallow } from 'enzyme';
import { RawLogin, styles, mapStateToProps } from './index';

it('Should render correctly the login page', () => {
    const wrapper = shallow(<RawLogin classes={{}} popupError={true} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should keep using the same styles', () => {
    const theme = {
        spacing: {
            unit: 1
        },
        palette: {
            error: {}
        }
    };

    expect(styles(theme)).toMatchSnapshot();
    expect(mapStateToProps({
        user: {}
    })).toMatchSnapshot();
});
