import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import TweetInputBox from './TweetInputBox';
import Tweet from './Tweet';

const messages = defineMessages({
    quoteMessageLabel: {
        id: 'widget.twitter.tweet.quoteMessageLabel',
        defaultMessage: 'Add a message'
    },
});

export class RawQuotePopup extends Component {
    render () {
        return <div>
            <TweetInputBox
                onUpdateText={this.props.onUpdateText}
                label={this.props.intl.formatMessage(messages.quoteMessageLabel)}
                />
            <Tweet
                tweet={this.props.tweet}
                retweeted={this.props.tweet.author.screen_name}
                isQuote={false}
                />
        </div>;
    }
}

const QuotePopup = injectIntl(RawQuotePopup);

QuotePopup.propTypes = {
    onUpdateText: PropTypes.func.isRequired,
    tweet: PropTypes.shape({
        author: PropTypes.shape({
            screen_name: PropTypes.string
        })
    })
};

RawQuotePopup.propTypes = {
    ...QuotePopup.propTypes,
    intl: PropTypes.object.isRequired
};

export default QuotePopup;
