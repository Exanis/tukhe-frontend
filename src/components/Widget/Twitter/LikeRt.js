import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import ConditionalComponent from "../../../components/ConditionalComponent/index";

import QuotePopup from './QuotePopup';


export const classes = theme => ({
    likeRtIconContainer: {
        fontSize: 14,
        marginLeft: 10,
        display: 'inline-block',
    },
    likeRtIcon: {
        fontSize: 14,
        marginRight: 2,
        paddingTop: 2
    },
    likeRtContainer: {
        marginTop: 5
    },
});

const messages = defineMessages({
    quoteMessageTitle: {
        id: 'widget.twitter.tweet.quoteMessage',
        defaultMessage: 'Quote tweet'
    },
});

export class RawLikeRt extends Component {
    state = {
        text: '',
        anchorEl: null,
    };

    findTweet = id => tweet => tweet.id === id;
    replaceSingleTweetByStatus = status => tweet => status[0];
    replaceTweetByStatus = status => this.props.updateElement(
        this.findTweet(this.props.tweet.id),
        this.replaceSingleTweetByStatus(status)
    );

    likeTweet = () => {
        if (this.props.tweet.user_liked)
            this.props.actionWithAccount(
                'dislike',
                {
                    'tweet': this.props.tweet.id
                },
                this.replaceTweetByStatus
            );
        else
            this.props.actionWithAccount(
                'like',
                {
                    'tweet': this.props.tweet.id
                },
                this.replaceTweetByStatus
            );
    };

    retweet = () => {
        if (this.props.tweet.user_retweeted)
            this.props.actionWithAccount(
                'unretweet',
                {
                    'tweet': this.props.tweet.id
                },
                this.replaceTweetByStatus
            );
        else
            this.props.actionWithAccount(
                'retweet',
                {
                    'tweet': this.props.tweet.id
                },
                this.replaceTweetByStatus
            );
        this.setState({anchorEl: null});
    };

    onQuoteSent = status => this.props.addToWidgetData(status);

    onSendTweet = () => {
        if (this.state.text.length === 0 || this.state.text.length > 280)
            return;
        this.props.actionWithAccount(
            'quote',
            {
                'tweet_from': this.props.tweet.author.screen_name,
                'tweet_id': this.props.tweet.id,
                'message': this.state.text
            },
            this.onQuoteSent
        );
        this.props.closeElementPopup();
    };

    onUpdateTweetText = text => {
        if ((this.state.text.length === 0 || this.state.text.length > 280) && text.length > 0 && text.length <= 280) {
            this.props.updatePopupProps({
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'}>
                        <FormattedMessage
                            id={'widget.twitter.tweet.quote'}
                            defaultMessage={'Quote'}
                        />
                    </Button>
                ]
            })
        } else if (this.state.text.length > 0 && this.state.text.length <= 280 && (text.length === 0 || text.length > 280))
            this.props.updatePopupProps({
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'} disabled>
                        <FormattedMessage
                            id={'widget.twitter.tweet.quote'}
                            defaultMessage={'Quote'}
                        />
                    </Button>
                ]
            });
        this.setState({text: text});
    };

    openQuotePopup = () => {
        this.setState({
            anchorEl: null,
            text: ''
        });
        this.props.displayElementInPopup(
            <QuotePopup
                tweet={this.props.tweet}
                onUpdateText={this.onUpdateTweetText}
            />,
            {
                fullWidth: true,
                maxWidth: 'sm',
                title: this.props.intl.formatMessage(messages.quoteMessageTitle),
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'}>
                        <FormattedMessage
                            id={'widget.twitter.tweet.quote'}
                            defaultMessage={'Quote'}
                        />
                    </Button>
                ]
            }
        );
    };

    onOpenRtMenu = ev => this.setState({anchorEl: ev.target});
    onCloseRtMenu = () => this.setState({anchorEl: null});

    render() {
        return <div className={this.props.classes.likeRtContainer}>
            <div className={this.props.classes.likeRtIconContainer}>
                <Icon className={this.props.classes.likeRtIcon} color={this.props.tweet.user_retweeted ? 'secondary' : 'inherit'} onClick={this.onOpenRtMenu}>sync</Icon>
                {this.props.tweet.retweet_count}
            </div>
            <div className={this.props.classes.likeRtIconContainer}>
                <Icon className={this.props.classes.likeRtIcon} color={this.props.tweet.user_liked ? 'secondary' : 'inherit'} onClick={this.likeTweet}>favorite</Icon>
                {this.props.tweet.like_count}
            </div>

            <Menu
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.onCloseRtMenu}
                >
                <MenuItem onClick={this.retweet}>
                    <ConditionalComponent render={!this.props.tweet.user_retweeted}>
                        <FormattedMessage
                            id={'widget.twitter.tweet.retweet'}
                            defaultMessage={'Retweet'}
                            />
                    </ConditionalComponent>
                    <ConditionalComponent render={this.props.tweet.user_retweeted}>
                        <FormattedMessage
                            id={'widget.twitter.tweet.unretweet'}
                            defaultMessage={'Un-retweet'}
                            />
                    </ConditionalComponent>
                </MenuItem>
                <MenuItem onClick={this.openQuotePopup}>
                    <FormattedMessage
                        id={'widget.twitter.tweet.quote'}
                        defaultMessage={'Quote'}
                        />
                </MenuItem>
            </Menu>
        </div>
    }
}

const LikeRt = withStyles(classes)(injectIntl(RawLikeRt));

LikeRt.propTypes = {
    tweet: PropTypes.shape({
        user_liked: PropTypes.bool.isRequired,
        user_retweeted: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        author: PropTypes.shape({
            screen_name: PropTypes.string.isRequired,
        }),
        retweet_count: PropTypes.number,
        like_count: PropTypes.number
    }),
    actionWithAccount: PropTypes.func.isRequired,
    updateElement: PropTypes.func.isRequired,
    addToWidgetData: PropTypes.func.isRequired,
    updatePopupProps: PropTypes.func.isRequired,
    displayElementInPopup: PropTypes.func,
    closeElementPopup: PropTypes.func.isRequired
};

RawLikeRt.propTypes = {
    ...LikeRt.propTypes,
    intl: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export default LikeRt;
