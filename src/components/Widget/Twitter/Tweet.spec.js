import React from 'react';
import { shallow } from 'enzyme';
import { RawTweet, classes } from "./Tweet";

const props = {
    displayElementInPopup: jest.fn(),
    tweet: {
        id: 'tweet number one',
        retweeted_status: null,
        text: "Test de \ntweet [badlink] [otherlink] [link] [media]",
        quoted: {
            id: 'tweetid',
        },
        urls: [
            {
                'target': 'twitter/tweetid',
                'short': '[link]'
            },
            {
                'target': 'http://www.google.fr',
                'short': '[badlink]'
            },
            {
                'target': 'http://www.twitter.com',
                'short': '[otherlink]'
            }
        ],
        media: [
            {
                url: '[media]',
                media_url: 'real media url'
            }
        ],
        author: {
            name: 'test',
            avatar: 'http://example.org/image.gif',
            screen_name: 'test screen name',
            protected: false,
            verified: true
        },
        user_liked: true,
        user_retweeted: true,
        replying_to: 'test reply',
    },
    isQuote: false,
    updateElement: jest.fn(),
    actionWithAccount: jest.fn(),
    closeElementPopup: jest.fn(),
    updatePopupProps: jest.fn(),
    addToWidgetData: jest.fn(),
    retweeted: 'test',
    classes: {},
    intl: {
        formatMessage: () => 'test'
    }
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawTweet {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly when is quote', () => {
    const testProps = {
        ...props,
        isQuote: true
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly when no tweet is quoted', () => {
    const testProps = {
        ...props,
        tweet: {
            ...props.tweet,
            quoted: {
                id: 'anotherid',
            }
        }
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly when quoted tweet is not in links', () => {
    const testProps = {
        ...props,
        tweet: {
            ...props.tweet,
            quoted: null
        }
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly as a retweet', () => {
    const testProps = {
        ...props,
        tweet: {
            ...props.tweet,
            retweeted_status: props.tweet
        }
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly when there is no media', () => {
    const testProps = {
        ...props,
        tweet: {
            ...props.tweet,
            media: []
        }
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should display media as expected with prop', () => {
    const wrapper = shallow(<RawTweet {...props} />);

    expect(wrapper.instance().displayMediaInPopup([{}], 0, 'test', {})()).toMatchSnapshot();
});

it('Should display media as expected without func in props', () => {
    const testProps = {
        ...props,
        displayElementInPopup: null
    };
    const wrapper = shallow(<RawTweet {...testProps} />);

    expect(wrapper.instance().displayMediaInPopup(['test'], 0, 'test', {})()).toBeNull();
});

it('Should render theme consistently', () => {
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

