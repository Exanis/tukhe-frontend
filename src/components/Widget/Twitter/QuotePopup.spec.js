import React from 'react';
import { shallow } from 'enzyme';
import { RawQuotePopup } from "./QuotePopup";

const props = {
    onUpdateText: jest.fn(),
    tweet: {
        author: {
            screen_name: 'test'
        }
    },
    intl: {
        formatMessage: () => 'text'
    }
};

it('Should render correctly', () => {
    const wrapper = shallow(<RawQuotePopup {...props} />);

    expect(wrapper).toMatchSnapshot();
});
