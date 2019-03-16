import React from 'react';
import { shallow } from 'enzyme';
import { classes, RawLikeRt } from './LikeRt';

const props = {
    tweet: {
        user_liked: true,
        user_retweeted: true,
        id: 'tweet',
        author: {
            screen_name: 'test_user'
        },
        retweet_count: 12,
        like_count: 42
    },
    actionWithAccount: jest.fn(),
    updateElement: jest.fn(),
    addToWidgetData: jest.fn(),
    updatePopupProps: jest.fn(),
    displayElementInPopup: jest.fn(),
    closeElementPopup: jest.fn(),
    classes: {},
    intl: {
        formatMessage: () => 'test'
    }
};

it('Should render correctly with props', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should correctly open quote popup', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    wrapper.instance().openQuotePopup();
    expect(props.displayElementInPopup).toHaveBeenCalled();
});

it('Should correctly update actions', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    expect(wrapper.state('text')).toEqual('');
    wrapper.instance().onUpdateTweetText('testing');
    expect(wrapper.state('text')).toEqual('testing');
    wrapper.instance().onUpdateTweetText('another testing');
    wrapper.instance().onUpdateTweetText('a'.repeat(290));
    wrapper.instance().onUpdateTweetText('test');
    expect(props.updatePopupProps).toHaveBeenCalledTimes(3);
});

it('Should correctly send (or not) tweet', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    wrapper.instance().onSendTweet();
    expect(props.actionWithAccount).not.toHaveBeenCalled();
    wrapper.instance().onUpdateTweetText('a'.repeat(290));
    wrapper.instance().onSendTweet();
    expect(props.actionWithAccount).not.toHaveBeenCalled();
    wrapper.instance().onUpdateTweetText('test');
    wrapper.instance().onSendTweet();
    expect(props.actionWithAccount).toHaveBeenCalled();
    expect(props.closeElementPopup).toHaveBeenCalled();
});

it('Should update when the quoted tweet is sent', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    wrapper.instance().onQuoteSent('test');
    expect(props.addToWidgetData).toHaveBeenCalledWith('test');
});

it('Should use action when retweet', () => {
    const testState = {
        ...props,
        tweet: {
            ...props.tweet,
            user_retweeted: false
        }
    };

    const wrapper_retweeted = shallow(<RawLikeRt {...props} />);
    const wrapper_not_retweeted = shallow(<RawLikeRt {...testState} />);

    wrapper_retweeted.instance().retweet();
    wrapper_not_retweeted.instance().retweet();
    expect(wrapper_not_retweeted).toMatchSnapshot();
    expect(props.actionWithAccount).toHaveBeenCalled();
    expect(testState.actionWithAccount).toHaveBeenCalled();
});

it('Should use action when liked', () => {
    const testState = {
        ...props,
        tweet: {
            ...props.tweet,
            user_liked: false
        }
    };

    const wrapper_liked = shallow(<RawLikeRt {...props} />);
    const wrapper_not_liked = shallow(<RawLikeRt {...testState} />);

    wrapper_liked.instance().likeTweet();
    wrapper_not_liked.instance().likeTweet();
    expect(wrapper_not_liked).toMatchSnapshot();
    expect(props.actionWithAccount).toHaveBeenCalled();
    expect(testState.actionWithAccount).toHaveBeenCalled();
});

it('Should correctly match on update', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    expect(wrapper.instance().findTweet('test')({id: 'test'})).toBeTruthy();
    expect(wrapper.instance().findTweet('test')({id: 'badTest'})).toBeFalsy();
    expect(wrapper.instance().replaceSingleTweetByStatus(['test'])('try')).toEqual('test');
    wrapper.instance().replaceTweetByStatus('test');
    expect(props.updateElement).toHaveBeenCalled();
});

it('Should keep theming coherent', () => {
    expect(classes('')).toMatchSnapshot();
});

it('Should correctly open and close menu', () => {
    const wrapper = shallow(<RawLikeRt {...props} />);

    expect(wrapper.state('anchorEl')).toBeNull();
    wrapper.instance().onOpenRtMenu({target: 'test'});
    expect(wrapper.state('anchorEl')).toEqual('test');
    wrapper.instance().onCloseRtMenu();
    expect(wrapper.state('anchorEl')).toBeNull();
});
