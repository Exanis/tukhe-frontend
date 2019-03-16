import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import InfiniteScroll from 'react-infinite-scroller';
import Tweet from './Tweet';
import TweetPopup from './TweetPopup';

const messages = defineMessages({
    newMessageTitle: {
        id: 'widget.twitter.tweet.newTweetTitle',
        defaultMessage: 'New Tweet'
    }
});

export class RawFeed extends Component {
    state = {
        displayPages: 0,
        text: '',
        files: []
    };

    canTweet = (state = null) => {
        if (state === null)
            state = this.state;

        return (
            (state.text.length !== 0 || state.files.length !== 0)
            && state.text.length <= 280
        );
    };

    pseudoLoadData = (page) => this.setState({displayPages: page});

    addStatusToWidget = status => this.props.addToWidgetData(status);

    onSendTweet = () => {
        if (!this.canTweet())
            return;

        const tweetData = new FormData();

        tweetData.append('message', this.state.text);
        this.state.files.forEach(
            file => tweetData.append('file', file)
        );

        this.props.actionWithAccount(
            'tweet',
            tweetData,
            this.addStatusToWidget
        );
        this.props.closeElementPopup();
    };

    updateTweetButton = (text, files) => {
        const actualCan = this.canTweet();
        const nextCan = this.canTweet({
            text: text,
            files: files
        });

        if (!actualCan && nextCan) {
            this.props.updatePopupProps({
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'}>
                        <FormattedMessage
                            id={'widget.twitter.tweet.tweet'}
                            defaultMessage={'Tweet'}
                        />
                    </Button>
                ]
            })
        } else if (actualCan && !nextCan) {
            this.props.updatePopupProps({
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'} disabled>
                        <FormattedMessage
                            id={'widget.twitter.tweet.tweet'}
                            defaultMessage={'Tweet'}
                        />
                    </Button>
                ]
            });
        }
    };

    onUpdateTweetFiles = files => {
        this.updateTweetButton(this.state.text, files);
        this.setState({files: files});
    };

    onUpdateTweetText = text => {
        this.updateTweetButton(text, this.state.files);
        this.setState({text: text});
    };

    openNewTweetPopup = () => {
        this.setState({
            anchorEl: null,
            text: ''
        });
        this.props.displayElementInPopup(
            <TweetPopup
                onUpdateText={this.onUpdateTweetText}
                onUpdateFiles={this.onUpdateTweetFiles}
                files={this.state.files}
                text={this.state.text}
            />,
            {
                fullWidth: true,
                maxWidth: 'sm',
                title: this.props.intl.formatMessage(messages.newMessageTitle),
                actions: [
                    <Button key={1} onClick={this.onSendTweet} variant={'contained'} color={'primary'} disabled>
                        <FormattedMessage
                            id={'widget.twitter.tweet.sendTweet'}
                            defaultMessage={'Tweet'}
                        />
                    </Button>
                ]
            }
        );
    };

    render () {
        if (!this.props.data)
            return null;

        const items = this.props.data.slice(
            0, (this.state.displayPages + 1) * 10
        ).map(tweet => <Tweet
            updateElement={this.props.updateElement}
            actionWithAccount={this.props.actionWithAccount}
            displayElementInPopup={this.props.displayElementInPopup}
            tweet={tweet}
            key={tweet.id}
            closeElementPopup={this.closeElementPopup}
            updatePopupProps={this.props.updatePopupProps}
        />);

        return <List className={this.props.containerClass}>
            <InfiniteScroll
                pageStart={0}
                loadMore={this.pseudoLoadData}
                hasMore={(this.state.displayPages + 1) * 10 < this.props.data.length}
                useWindow={false}
                >
                {items}
            </InfiniteScroll>
        </List>;
    }

    componentDidMount() {
        this.props.startWidgetProcess({
            target: this.props.refreshWithAccount,
            interval: 61000,
            widget: this.props.uuid
        });
        this.props.updateWidgetActions([
            <IconButton onClick={this.openNewTweetPopup}>
                <Icon fontSize={'small'}>add_comment</Icon>
            </IconButton>
        ])
    }

    componentWillUnmount() {
        this.props.stopWidgetProcess({
            widget: this.props.uuid
        })
    }
}

const Feed = injectIntl(RawFeed);

Feed.propTypes = {
    actionWithAccount: PropTypes.func.isRequired,
    addToWidgetData: PropTypes.func.isRequired,
    closeElementPopup: PropTypes.func.isRequired,
    updatePopupProps: PropTypes.func.isRequired,
    displayElementInPopup: PropTypes.func.isRequired,
    data: PropTypes.array,
    updateElement: PropTypes.func.isRequired,
    containerClass: PropTypes.string,
    startWidgetProcess: PropTypes.func.isRequired,
    refreshWithAccount: PropTypes.func.isRequired,
    uuid: PropTypes.string,
    updateWidgetActions: PropTypes.func.isRequired,
    stopWidgetProcess: PropTypes.func.isRequired
};
RawFeed.propTypes = {
    ...Feed.propTypes,
    intl: PropTypes.object.isRequired
};

export default Feed;
