import React from 'react';
import { shallow } from 'enzyme';
import TweetInputBox from './TweetInputBox';

const props = {
    onUpdateText: jest.fn(),
    label: 'test label'
};

it('Should render correctly', () => {
    const wrapper = shallow(<TweetInputBox {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly with a long text', () => {
    const wrapper = shallow(<TweetInputBox {...props} />);

    wrapper.instance().onUpdateText({
        target: {
            value: 'a'.repeat(279)
        }
    });
    expect(wrapper).toMatchSnapshot();
});

it('Should correctly update text', () => {
    const wrapper = shallow(<TweetInputBox {...props} />);

    wrapper.instance().onUpdateText({
        target: {
            value: 'test'
        }
    });
    expect(props.onUpdateText).toHaveBeenCalledWith('test');
    expect(wrapper.state('text')).toEqual('test');
});
