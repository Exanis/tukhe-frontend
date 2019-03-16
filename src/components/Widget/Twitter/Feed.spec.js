import React from 'react';
import { shallow } from 'enzyme';
import { RawFeed } from './Feed';

const props = {
    actionWithAccount: jest.fn(),
    addToWidgetData: jest.fn(),
    closeElementPopup: jest.fn(),
    updatePopupProps: jest.fn(),
    displayElementInPopup: jest.fn(),
    data: [{
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
    }],
    updateElement: jest.fn(),
    containerClass: 'test class',
    startWidgetProcess: jest.fn(),
    refreshWithAccount: jest.fn(),
    uuid: 'uuid',
    updateWidgetActions: jest.fn(),
    stopWidgetProcess: jest.fn(),
    intl: {
        formatMessage: () => 'test'
    }
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
    expect(props.stopWidgetProcess).toHaveBeenCalledWith({
        widget: 'uuid'
    });
});

it('Should render correctly without data', () => {
    const testProps = {
        ...props,
        data: null
    };
    const wrapper = shallow(<RawFeed {...testProps}/>);

    expect(wrapper).toMatchSnapshot();
});

it('Should correctly move between pages', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    wrapper.instance().pseudoLoadData(2);
    expect(wrapper.state('displayPages')).toEqual(2);
});

it('Should open a popup on new tweet', () => {
    const wrapper = shallow(<RawFeed {...props}/>);

    wrapper.instance().openNewTweetPopup();
    expect(props.displayElementInPopup).toHaveBeenCalled();
});

it('Should update state on files / text changes', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    wrapper.instance().onUpdateTweetFiles(['file1']);
    wrapper.instance().onUpdateTweetText('test text');
    expect(wrapper.state('files')).toEqual(['file1']);
    expect(wrapper.state('text')).toEqual('test text');
});

it('Should correctly update tweet button', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    wrapper.instance().onUpdateTweetText('text');
    wrapper.instance().updateTweetButton('other text', []);
    wrapper.instance().onUpdateTweetText('');
    expect(props.updatePopupProps).toHaveBeenCalledTimes(3);
});

it('Should correctly send tweet', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    expect(wrapper.instance().onSendTweet()).not.toBeDefined();
    wrapper.instance().onUpdateTweetFiles(['file1', 'file2']);
    wrapper.instance().onSendTweet();
    expect(props.actionWithAccount).toHaveBeenCalled();
    expect(props.closeElementPopup).toHaveBeenCalled();
    wrapper.instance().addStatusToWidget('test');
    expect(props.addToWidgetData).toHaveBeenCalledWith('test');
});

it('Should correctly detect if I can tweet', () => {
    const wrapper = shallow(<RawFeed {...props} />);

    expect(wrapper.instance().canTweet()).toBeFalsy();
    expect(wrapper.instance().canTweet({
        text: 'test text',
        files: []
    })).toBeTruthy();
    expect(wrapper.instance().canTweet({
        text: '',
        files: ['file1']
    })).toBeTruthy();
    expect(wrapper.instance().canTweet({
        text: 't'.repeat(290),
        files: []
    })).toBeFalsy();
});
