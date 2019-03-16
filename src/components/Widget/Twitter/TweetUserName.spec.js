import React from 'react';
import { shallow } from 'enzyme';
import { classes, RawTweetUserName } from "./TweetUserName";

const props = {
    user: {
        protected: true,
        verified: true,
        name: 'Test user',
        screen_name: 'test_user'
    },
    classes: {}
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawTweetUserName {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should keep styling consistant', () => {
    expect(classes({
        palette: {
            primary: {
                light: '#aaa'
            }
        }
    })).toMatchSnapshot();
});
