import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


export const classes = theme => ({
    tweetMedia: {
        minHeight: 80,
        minWidth: 80,
        flex: 1,
        backgroundSize: 'cover',
        display: "block"
    },
});

export class RawTweetMedia extends Component {
    render () {
        return <a
            onClick={this.props.onMediaClick}
            className={this.props.classes.tweetMedia}
            style={{backgroundImage: `url(${this.props.media.media_url})`}}
        />;
    }
}

const TweetMedia = withStyles(classes)(RawTweetMedia);

TweetMedia.propTypes = {
    onMediaClick: PropTypes.func.isRequired,
    media: PropTypes.shape({
        media_url: PropTypes.string.isRequired
    }).isRequired
};
RawTweetMedia.propTypes = {
    ...TweetMedia.propTypes,
    classes: PropTypes.object.isRequired
};

export default TweetMedia;
