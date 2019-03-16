import React, {Component} from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import BasicPopup from '../../BasicPopup';

const messages = defineMessages({
    title: {
        id: 'component.main.Catalog.title',
        defaultMessage: 'Add a widget'
    },
    twitter: {
        id: 'component.main.Catalog.provider.twitter',
        defaultMessage: 'Twitter'
    },
    misc: {
        id: 'component.main.Catalog.provider.misc',
        defaultMessage: 'Others'
    },
    twitter_feed_main: {
        id: 'component.main.Catalog.widget.twitter.feed.main',
        defaultMessage: 'Twitter feed'
    },
    twitter_feed_secondary: {
        id: 'component.main.Catalog.widget.twitter.feed.secondary',
        defaultMessage: 'Display all your tweets from one or multiple accounts'
    },
    twitter_notifications_main: {
        id: 'component.main.Catalog.widget.twitter.notification.main',
        defaultMessage: 'Twitter notifications'
    },
    twitter_notifications_secondary: {
        id: 'component.main.Catalog.widget.twitter.notification.secondary',
        defaultMessage: 'Display all your notifications from one or multiple twitter accounts'
    },
    misc_rss_main: {
        id: 'component.main.Catalog.widget.misc.rss.main',
        defaultMessage: 'RSS flux'
    },
    misc_rss_secondary: {
        id: 'component.main.Catalog.widget.misc.rss.secondary',
        defaultMessage: 'Display latest news from an RSS feed'
    }
});

export class RawCatalog extends Component {
    state = {
        currentTab: 0
    };

    onSelectWidget = (providers, widget) => () => this.props.onSelectWidget(providers[this.state.currentTab], widget);
    onTabChange = (_, value) => this.setState({currentTab: value});

    render() {
        const providers = Object.keys(this.props.widgets);
        const tabs = providers.map(
            provider => <Tab key={provider} label={this.props.intl.formatMessage(messages[provider])} />
        );
        const widgets = this.props.widgets[providers[this.state.currentTab]].map(
            widget => <ListItem button={true} onClick={this.onSelectWidget(providers, widget)} key={`${providers[this.state.currentTab]}_${widget}`}>
                <ListItemText
                    primary={this.props.intl.formatMessage(messages[`${providers[this.state.currentTab]}_${widget}_main`])}
                    secondary={this.props.intl.formatMessage(messages[`${providers[this.state.currentTab]}_${widget}_secondary`])}
                    />
            </ListItem>
        );

        return <BasicPopup
            title={this.props.intl.formatMessage(messages.title)}
            onClose={this.props.onClose}
            open={this.props.open}
            >
            <AppBar position="static" color="default">
                <Tabs
                    value={this.state.currentTab}
                    onChange={this.onTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    >
                    {tabs}
                </Tabs>
            </AppBar>
            <List>
                {widgets}
            </List>
        </BasicPopup>
    }
}

const Catalog = injectIntl(RawCatalog);

Catalog.propTypes = {
    widgets: PropTypes.object.isRequired,
    onSelectWidget: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

RawCatalog.propTypes = {
    ...Catalog.propTypes,
    intl: PropTypes.object
};

export default Catalog;
