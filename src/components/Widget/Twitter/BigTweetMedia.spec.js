import React from 'react';
import { shallow } from 'enzyme';
import { classes, RawBigTweetMedia } from "./BigTweetMedia";

const props = {
    mediaList: [1, 2, 3],
    currentMedia: 0,
    displayMediaInPopup: jest.fn(),
    text: 'tweet text',
    author: {
        protected: true,
        verified: true,
        screen_name: 'test',
        name: 'test'
    },
    media: {
        type: 'media type',
        media_url: 'media url',
        display_url: 'display url',
        video: {
            variant: []
        }
    },
    classes: {
        bigMediaPicture: ''
    }
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawBigTweetMedia {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should keep styles coherent', () => {
    const theme = {
        palette: {
            primary: {
                main: '#000',
                light: '#aaa'
            }
        }
    };

    expect(classes(theme)).toMatchSnapshot();
});
