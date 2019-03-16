import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class TweetInputBox extends Component {
    state = {
        text: ''
    };

    onUpdateText = ev => {
        this.props.onUpdateText(ev.target.value);
        this.setState({text: ev.target.value});
    };

    render () {
        return <div>
            <TextField
                value={this.state.text}
                onChange={this.onUpdateText}
                multiline
                fullWidth
                label={this.props.label}
                />
            <LinearProgress
                variant="determinate"
                value={this.state.text.length / 2.8}
                color={this.state.text.length > 270 ? 'secondary' : 'primary'}
            />
        </div>;
    }
}

TweetInputBox.propTypes = {
    onUpdateText: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};
