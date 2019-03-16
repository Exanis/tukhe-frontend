import React from 'react';
import { shallow } from 'enzyme';
import Notifications from './Notifications';

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
    const wrapper = shallow(<Notifications {...props} />);

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
    const wrapper = shallow(<Notifications {...testProps}/>);

    expect(wrapper).toMatchSnapshot();
});

it('Should correctly move between pages', () => {
    const wrapper = shallow(<Notifications {...props} />);

    wrapper.instance().pseudoLoadData(2);
    expect(wrapper.state('displayPages')).toEqual(2);
});
