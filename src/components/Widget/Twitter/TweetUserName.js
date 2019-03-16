import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import ConditionalComponent from "../../../components/ConditionalComponent/index";
import PropTypes from 'prop-types';


export const classes = theme => ({
    spaced: {
        display: 'inline-block',
        marginRight: 5
    },
    icon: {
        fontSize: 12,
        color: theme.palette.primary.light,
        marginRight: 5
    },
});

export class RawTweetUserName extends Component {
    render() {
        return <div>
            <Typography component="span" variant="subtitle1" inline className={this.props.classes.spaced}>{this.props.user.name}</Typography>
            <ConditionalComponent render={this.props.user.protected}>
                <Icon className={this.props.classes.icon}>lock</Icon>
            </ConditionalComponent>
            <ConditionalComponent render={this.props.user.verified}>
                <Icon className={this.props.classes.icon}>verified_user</Icon>
            </ConditionalComponent>
            <Typography component="span" variant="caption" inline color={'textSecondary'} className={this.props.classes.spaced}>@{this.props.user.screen_name}</Typography>
        </div>;
    }
}

const TweetUserName = withStyles(classes)(RawTweetUserName);

TweetUserName.propTypes = {
    user: PropTypes.shape({
        protected: PropTypes.bool.isRequired,
        verified: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        screen_name: PropTypes.string.isRequired
    }).isRequired
};

RawTweetUserName.propTypes = {
    classes: PropTypes.object.isRequired,
    ...TweetUserName.propTypes
};

export default TweetUserName;
