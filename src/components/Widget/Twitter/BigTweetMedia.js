import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ConditionalComponent from "../../../components/ConditionalComponent/index";
import TweetUserName from './TweetUserName';
import TweetVideo from './TweetVideo';

export const classes = theme => ({
    bigMediaContainer: {
        height: '80vh',
    },
    bigMediaPicture: {
        width: '80%',
        flex: '0.8',
        floatLeft: 'auto',
        floatRight: 'auto',
        height: "100%",
        objectFit: 'contain'
    },
    bigMediaSubText: {
        width: '60%',
        marginLeft: '20%',
    },
    bigMediaPictureContainer: {
        width: "100%",
        height: 'calc(100% - 128px)',
        display: 'flex',
        alignItems: 'center'
    },
    bigMediaLink: {
        flex: '0.1',
        width: '10%',
        textAlign: 'center'
    },
    bigMediaShortcuts: {
        width: '60%',
        marginLeft: '20%',
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    bigMediaShortcutsLinkLeft: {
        fontSize: 12,
        color: theme.palette.primary.light,
        flex: 1
    },
    bigMediaShortcutsLinkRight: {
        fontSize: 12,
        color: theme.palette.primary.light,
    },
    tweetText: {
        wordBreak: 'break-word',
        '& a': {
            textDecoration: 'none',
            color: theme.palette.primary.main,
            '&:visited': {
                color: theme.palette.primary.light
            },
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    },
});

export class RawBigTweetMedia extends Component {
    render() {
        return <div className={this.props.classes.bigMediaContainer}>
            <div className={this.props.classes.bigMediaPictureContainer}>
                <ConditionalComponent render={Boolean(this.props.mediaList[this.props.currentMedia - 1])}>
                    <a className={this.props.classes.bigMediaLink} onClick={this.props.displayMediaInPopup(
                        this.props.mediaList,
                        this.props.currentMedia - 1,
                        this.props.text,
                        this.props.author)}>
                        <ArrowLeft fontSize='large' />
                    </a>
                </ConditionalComponent>
                <ConditionalComponent render={!Boolean(this.props.mediaList[this.props.currentMedia - 1])}>
                    <div className={this.props.classes.bigMediaLink} />
                </ConditionalComponent>
                <ConditionalComponent render={this.props.media.type === 'photo'}>
                    <img src={`${this.props.media.media_url}:large`} className={this.props.classes.bigMediaPicture} />
                </ConditionalComponent>
                <ConditionalComponent render={this.props.media.type !== 'photo'}>
                    <TweetVideo gif={this.props.media.type === 'animated_gif'} video={this.props.media.video} className={this.props.classes.bigMediaPicture} />
                </ConditionalComponent>
                <ConditionalComponent render={Boolean(this.props.mediaList[this.props.currentMedia + 1])}>
                    <a className={this.props.classes.bigMediaLink} onClick={this.props.displayMediaInPopup(
                        this.props.mediaList,
                        this.props.currentMedia + 1,
                        this.props.text,
                        this.props.author)}>
                        <ArrowRight fontSize='large' />
                    </a>
                </ConditionalComponent>
                <ConditionalComponent render={!Boolean(this.props.mediaList[this.props.currentMedia + 1])}>
                    <div className={this.props.classes.bigMediaLink} />
                </ConditionalComponent>
            </div>
            <div className={this.props.classes.bigMediaShortcuts}>
                <a href={`${this.props.media.media_url}:large`} className={this.props.classes.bigMediaShortcutsLinkLeft}>
                    <FormattedMessage
                        id={"widget.twitter.tweet.viewOriginal"}
                        defaultMessage={'View image'}
                        />
                </a>
                <a href={`https://${this.props.media.display_url}`} className={this.props.classes.bigMediaShortcutsLinkRight}>
                    <FormattedMessage
                        id={"widget.twitter.tweet.viewImageTweet"}
                        defaultMessage={'View original tweet'}
                        />
                </a>
            </div>
            <div className={this.props.classes.bigMediaSubText}>
                <div className={this.props.classes.tweetText}>
                    <TweetUserName user={this.props.author}/>
                    <Typography variant='body1'>{this.props.text}</Typography>
                </div>
            </div>
        </div>
    }
}

const BigTweetMedia = withStyles(classes)(RawBigTweetMedia);

BigTweetMedia.propTypes = {
    mediaList: PropTypes.array,
    currentMedia: PropTypes.number.isRequired,
    displayMediaInPopup: PropTypes.func,
    text: PropTypes.string,
    author: PropTypes.object,
    media: PropTypes.shape({
        type: PropTypes.string,
        media_url: PropTypes.string,
        display_url: PropTypes.string
    })
};
RawBigTweetMedia.propTypes = {
    ...BigTweetMedia.propTypes,
    classes: PropTypes.object
};

export default BigTweetMedia;
