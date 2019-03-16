import React from 'react';
import { shallow } from 'enzyme';
import { classes, RawTweetPopup } from './TweetPopup';

const props = {
    onUpdateFiles: jest.fn(),
    onUpdateText: jest.fn(),
    classes: {},
    intl: {
        formatMessage: () => 'test'
    }
};

global.URL.createObjectURL = jest.fn();

it('Should render correctly', () => {
    const wrapper = shallow(<RawTweetPopup {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('Should manage images correctly', () => {
    const wrapper = shallow(<RawTweetPopup {...props} />);

    wrapper.instance().openAttachmentField('Image')();
    wrapper.instance().onFileEvent(4)(['file1', 'file2', 'file3', 'file4', 'file5']);
    expect(wrapper.state('files')).toEqual(['file1', 'file2', 'file3', 'file4']);
    wrapper.instance().propagateFileUpdate();
    expect(props.onUpdateFiles).toHaveBeenCalledWith(['file1', 'file2', 'file3', 'file4']);
    wrapper.instance().onRemoveFile('file2')({stopPropagation: jest.fn()});
    expect(wrapper.state('files')).toEqual(['file1', 'file3', 'file4']);
    wrapper.instance().onFileEvent(4)(['file2']);
    expect(wrapper.state('files')).toEqual(['file1', 'file3', 'file4', 'file2']);
    expect(wrapper).toMatchSnapshot();
});

it('Should manage videos correctly', () => {
    const wrapper = shallow(<RawTweetPopup {...props} />);

    wrapper.instance().openAttachmentField('Video')();
    wrapper.instance().onFileEvent(1)(['video']);
    expect(wrapper).toMatchSnapshot();
});

it('Should manage gif correctly', () => {
    const wrapper = shallow(<RawTweetPopup {...props} />);

    wrapper.instance().openAttachmentField('Gif')();
    wrapper.instance().onFileEvent(1)('test');
    expect(wrapper).toMatchSnapshot();
});

it('Should display proper dropzone', () => {
    const wrapper = shallow(<RawTweetPopup {...props} />);

    expect(wrapper.instance().displayDropZone('test')({
        getRootProps: () => {},
        getInputProps: () => {}
    })).toMatchSnapshot();
});

it('Should keep styling consistent', () => {
    const theme = {
        palette: {
            primary: {
                main: '#000',
            },
            secondary: {
                main: '#aef'
            },
            text: {
                secondary: '#f00'
            }
        }
    };

    expect(classes(theme)).toMatchSnapshot();
});
