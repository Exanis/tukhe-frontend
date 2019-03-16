import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TweetVideo extends Component {
    render() {
        const sources = this.props.video.variants.map(video => <source
            key={video.url}
            src={video.url}
            type={video.content_type}
            />
        );

        return <video
            className={this.props.className}
            autoplay="autoplay"
            controls={!this.props.gif}
            loop={this.props.gif}
            muted={false}
            preload="none"
        >{sources}</video>;
    }
}

TweetVideo.propTypes = {
    video: PropTypes.shape({
        variants: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string,
            content_type: PropTypes.string
        }))
    }).isRequired,
    className: PropTypes.string.isRequired,
    gif: PropTypes.bool
};
