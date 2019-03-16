import React from 'react';
import { RawTweetMedia, classes } from './TweetMedia';
import { shallow } from 'enzyme';

const props = {
    onMediaClick: jest.fn(),
    media: {
        media_url: 'url'
    },
    classes: {}
};

it('Should render as expected', () => {
    const wrapper = shallow(<RawTweetMedia {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should keep styling consistant', () => {
    expect(classes()).toMatchSnapshot();
});
