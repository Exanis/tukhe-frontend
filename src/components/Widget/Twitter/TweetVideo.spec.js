import React from 'react';
import { shallow } from 'enzyme';
import TweetVideo from './TweetVideo';

const props = {
    video: {
        variants: [{
            url: 'test',
            content_type: 'test content'
        }]
    },
    className: 'test class',
    gif: false
};

it('Should render correctly', () => {
    const wrapper = shallow(<TweetVideo {...props} />);

    expect(wrapper).toMatchSnapshot();
});
