import React from 'react';
import { shallow } from 'enzyme';
import { RawGiphy, classes } from './index';

const props = {
    onGifSelected: jest.fn(),
    classes: {}
};

it('Should render Giphy as expected', () => {
    const wrapper = shallow(<RawGiphy {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should correctly call parent function', () => {
    const wrapper = shallow(<RawGiphy {...props} />);

    wrapper.instance().onGifSelected({
        images: {
            original: {
                gif_url: 'test'
            }
        }
    });
    expect(props.onGifSelected).toHaveBeenCalledWith('test');
});

it('Should keep styling coherent', () => {
    const theme = {};

    expect(classes(theme)).toMatchSnapshot();
});
