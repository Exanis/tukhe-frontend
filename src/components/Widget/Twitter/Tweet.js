import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import GridList from '@material-ui/core/GridList';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ConditionalComponent from "../../../components/ConditionalComponent/index";

import TweetMedia from './TweetMedia';
import TweetUserName from './TweetUserName';
import LikeRt from './LikeRt';
import BigTweetMedia from './BigTweetMedia';

export const classes = theme => ({
    spaced: {
        display: 'inline-block',
        marginRight: 5
    },
    mediaGrid: {
        width: 160,
        borderRadius: 5,
        marginTop: '10px !important'
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
    quotedTweet: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 5,
        marginTop: 5
    },
});

const messages = defineMessages({
    retweeted: {
        id: 'widget.twitter.tweet.retweeted',
        defaultMessage: '{user} retweeted'
    },
    replying: {
        id: 'widget.twitter.tweet.replying',
        defaultMessage: 'Replying to {user}'
    },
});

export class RawTweet extends Component {
    makeUrlInTweet = (text, urls) => {
        return urls.reduce(
            (texts, url) => {
                return texts.reduce(
                    (sentences, sentence, i) => {
                        return sentences.concat(typeof(sentence) === 'string' ? sentence.split(url.short).reduce(
                            (parts, part, i) => {
                                if (i === 0)
                                    return [part];
                                return parts.concat(
                                    <a href={url.short} key={url.short}>{url.target}</a>,
                                    part
                                );
                            }, []
                        ) : sentence);
                    }, []
                );
            }, [text]
        );
    };
    makeLineBreak = (text, urls) => text.split('\n').map((item, key) => <span key={key}>{this.makeUrlInTweet(item, urls)}<br /></span>);
    addMediaPreview = (author, text, urls, mediaList) => {
        if (mediaList.length > 0) {
            const strippedText = text.replace(mediaList[0].url, '');
            const properText = this.makeLineBreak(strippedText, urls);
            const images = mediaList.map((media, i) => <TweetMedia onMediaClick={this.displayMediaInPopup(mediaList, i, properText, author)} key={media.media_url} media={media} />);

            return properText.concat(<GridList key='media' className={this.props.classes.mediaGrid} cellHeight={80} cols={2}>{images}</GridList>);
        }
        return this.makeLineBreak(text, urls);
    };
    formatTweetText = (author, text, urls, media) => this.addMediaPreview(author, text, urls, media);

    displayMediaInPopup = (mediaList, i, properText, author) => () => this.props.displayElementInPopup ? this.props.displayElementInPopup(
        <BigTweetMedia
            media={mediaList[i]}
            mediaList={mediaList}
            currentMedia={i}
            text={properText}
            author={author}
            displayMediaInPopup={this.displayMediaInPopup}
            />,
        {
            fullWidth: true,
            maxWidth: 'xl'
        }
    ) : null;

    render () {
        if (this.props.tweet.retweeted_status) {
            return <Tweet
                displayElementInPopup={this.props.displayElementInPopup}
                tweet={this.props.tweet.retweeted_status}
                retweeted={this.props.tweet.author.screen_name}
                isQuote={this.props.isQuote}
                updateElement={this.props.updateElement}
                actionWithAccount={this.props.actionWithAccount}
                closeElementPopup={this.props.closeElementPopup}
                updatePopupProps={this.props.updatePopupProps}
                addToWidgetData={this.props.addToWidgetData}
                />
        }
        let targetText = this.props.tweet.text;

        if (Boolean(this.props.tweet.quoted)) {
            const targetReplace = this.props.tweet.urls.find(link => {
                return link.target.substr(-1 * this.props.tweet.quoted.id.length) === this.props.tweet.quoted.id;
            });

            if (targetReplace)
                targetText = targetText.replace(targetReplace.short, '');
        }

        return <ListItem alignItems={'flex-start'} divider={!this.props.isQuote} className={this.props.isQuote ? this.props.classes.quotedTweet : ''}>
            <ConditionalComponent render={!this.props.isQuote}>
                <ListItemAvatar>
                    <Avatar
                        alt={this.props.tweet.author.name}
                        src={this.props.tweet.author.avatar}
                        />
                </ListItemAvatar>
            </ConditionalComponent>
            <ListItemText
                primary={
                    <React.Fragment>
                        { this.props.retweeted && <Typography variant={"caption"} color={"secondary"}>{this.props.intl.formatMessage(messages.retweeted, {user: this.props.retweeted})}</Typography>}
                        <TweetUserName user={this.props.tweet.author} />
                        { this.props.tweet.replying_to && <Typography variant={"caption"} color={"primary"}>{this.props.intl.formatMessage(messages.replying, {user: this.props.tweet.replying_to})}</Typography>}
                    </React.Fragment>
                }
                secondary={
                    <div className={this.props.classes.tweetText}>
                        {this.formatTweetText(
                            this.props.tweet.author,
                            targetText,
                            this.props.tweet.urls,
                            this.props.tweet.media
                        )}
                        {Boolean(this.props.tweet.quoted) && !this.props.isQuote && <Tweet
                            displayElementInPopup={this.props.displayElementInPopup}
                            tweet={this.props.tweet.quoted}
                            updateElement={this.props.updateElement}
                            actionWithAccount={this.props.actionWithAccount}
                            isQuote={true}
                            closeElementPopup={this.props.closeElementPopup}
                            updatePopupProps={this.props.updatePopupProps}
                            addToWidgetData={this.props.addToWidgetData}
                            />}
                        <ConditionalComponent render={Boolean(this.props.updateElement)}>
                            <LikeRt
                                tweet={this.props.tweet}
                                updateElement={this.props.updateElement}
                                actionWithAccount={this.props.actionWithAccount}
                                closeElementPopup={this.props.closeElementPopup}
                                displayElementInPopup={this.props.displayElementInPopup}
                                updatePopupProps={this.props.updatePopupProps}
                                addToWidgetData={this.props.addToWidgetData}
                            />
                        </ConditionalComponent>
                    </div>
                }
                />
        </ListItem>
    }
}
const Tweet = withStyles(classes)(injectIntl(RawTweet));
Tweet.propTypes = {
    displayElementInPopup: PropTypes.func,
    tweet: PropTypes.shape({
        retweeted_status: PropTypes.object,
        text: PropTypes.string,
        quoted: PropTypes.object,
        urls: PropTypes.arrayOf(PropTypes.shape({
            short: PropTypes.string,
            target: PropTypes.string,
        })),
        author: PropTypes.shape({
            name: PropTypes.string,
            avatar: PropTypes.string,
            screen_name: PropTypes.string,
        }),
        media: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string,
            media_url: PropTypes.string
        }))
    }),
    isQuote: PropTypes.bool,
    updateElement: PropTypes.func,
    actionWithAccount: PropTypes.func,
    closeElementPopup: PropTypes.func,
    updatePopupProps: PropTypes.func,
    addToWidgetData: PropTypes.func,
    retweeted: PropTypes.string,
    replying_to: PropTypes.string
};
RawTweet.propTypes = {
    ...Tweet.propTypes,
    intl: PropTypes.object,
    classes: PropTypes.object
};

export default Tweet;
