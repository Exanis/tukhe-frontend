import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ConditionalComponent from "../../../components/ConditionalComponent/index";
import Dropzone from 'react-dropzone';

import Giphy from '../../Giphy';
import TweetInputBox from './TweetInputBox';

export const classes = theme => ({
    dropZone: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 5,
        padding: 10,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        '& img, & video': {
            objectFit: 'cover',
            height: 100,
            width: 100,
            margin: 10,
            borderRadius: 5,
            '&img:hover': {
                border: `1px solid ${theme.palette.secondary.main}`,
                cursor: 'pointer'
            }
        }
    },
});

const messages = defineMessages({
    tweetText: {
        id: 'widget.twitter.tweet.newTweetText',
        defaultMessage: 'Write your message'
    },
    newMessageTitle: {
        id: 'widget.twitter.tweet.newTweetTitle',
        defaultMessage: 'New Tweet'
    }
});

export class RawTweetPopup extends Component {
    state = {
        displayImageField: false,
        displayGifField: false,
        displayVideoField: false,
        files: []
    };

    propagateFileUpdate = () => this.props.onUpdateFiles(this.state.files);

    onFileEvent = maxSize => ev => {
        const newFiles = this.state.files.concat(ev);

        if (newFiles.length <= maxSize)
            this.setState({files: newFiles}, this.propagateFileUpdate);
        else
            this.setState({files: newFiles.slice(0, maxSize)}, this.propagageFileUpdate);
    };

    onRemoveFile = target => ev => {
        ev.stopPropagation();
        this.setState({
            files: this.state.files.filter(file => file !== target)
        }, this.propagageFileUpdate);
    };

    openAttachmentField = type => () => {
        const targetState = {
            displayImageField: false,
            displayGifField: false,
            displayVideoField: false,
            files: []
        };

        targetState[`display${type}Field`] = true;
        this.setState(targetState);
    };

    displayDropZone = content => ({getRootProps, getInputProps}) => (
        <section className={this.props.classes.dropZone}>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                    {content}
                </p>
            </div>
        </section>
    );

    render() {
        return <div>
            <TweetInputBox
                onUpdateText={this.props.onUpdateText}
                label={this.props.intl.formatMessage(messages.tweetText)}
            />
            <IconButton onClick={this.openAttachmentField('Image')}>
                <Icon>add_photo_alternate</Icon>
            </IconButton>
            <IconButton onClick={this.openAttachmentField('Gif')}>
                <Icon>gif</Icon>
            </IconButton>
            <IconButton onClick={this.openAttachmentField('Video')}>
                <Icon>videocam</Icon>
            </IconButton>
            <ConditionalComponent render={this.state.displayImageField}>
                <Dropzone
                    accept="image/*"
                    multiple={true}
                    onDrop={this.onFileEvent(4)}
                >
                    {this.displayDropZone(this.state.files.length === 0 || !this.state.displayImageField ?
                        <FormattedMessage
                            id={"widget.twitter.tweet.image"}
                            defaultMessage={"Drag'n'drop some images or click here to select them!"}
                        />
                        : this.state.files.map((image, i) => <img key={i} src={URL.createObjectURL(image)}
                                                                  onClick={this.onRemoveFile(image)}/>))}
                </Dropzone>
            </ConditionalComponent>
            <ConditionalComponent render={this.state.displayGifField}>
                {this.state.files.length === 0 || !this.state.displayGifField ? <Giphy onGifSelected={this.onFileEvent(1)} /> : <img src={this.state.files[0]} onClick={this.onRemoveFile(this.state.files[0])} />}
            </ConditionalComponent>
            <ConditionalComponent render={this.state.displayVideoField}>
                <Dropzone
                    accept="video/*"
                    multiple={true}
                    onDrop={this.onFileEvent(1)}
                >
                    {this.displayDropZone(this.state.files.length === 0 || !this.state.displayVideoField ?
                        <FormattedMessage
                            id={"widget.twitter.tweet.video"}
                            defaultMessage={"Drag'n'drop a video or click here to select it!"}
                        />
                        : <video autoplay={false} controls={true} muted={true} loop={false}>
                            <source src={URL.createObjectURL(this.state.files[0])}/>
                        </video>)}
                </Dropzone>
            </ConditionalComponent>
        </div>
    }
}

const TweetPopup = withStyles(classes)(injectIntl(RawTweetPopup));

TweetPopup.propTypes = {
    onUpdateFiles: PropTypes.func.isRequired,
    onUpdateText: PropTypes.func.isRequired,
};
RawTweetPopup.propTypes = {
    ...TweetPopup.propTypes,
    classes: PropTypes.object,
    intl: PropTypes.object
};

export default TweetPopup;
