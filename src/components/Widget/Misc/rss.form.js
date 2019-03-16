import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import TextField from '@material-ui/core/TextField';

const messages = defineMessages({
    url: {
        id: 'widget.misc.rss.form.url',
        defaultMessage: 'RSS Url'
    }
});

export class RawRssForm extends Component {
    onUrlChange = ev => this.props.onConfigUpdate({url: ev.target.value});

    render () {
        return <TextField
            label={this.props.intl.formatMessage(messages.url)}
            value={this.props.config.url}
            fullWidth
            onChange={this.onUrlChange}
            />
    }

    componentDidMount() {
        this.props.onConfigUpdate({url: ''});
    }
}

const RssForm = injectIntl(RawRssForm);

RssForm.propTypes = {
    config: PropTypes.shape({
        url: PropTypes.string
    }).isRequired,
    onConfigUpdate: PropTypes.func.isRequired
};
RawRssForm.propTypes = {
    ...RssForm.propTypes,
    intl: PropTypes.object.isRequired
};

export default RssForm;
