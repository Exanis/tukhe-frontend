import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InfiniteScroll from 'react-infinite-scroller';

import RssForm from './rss.form';

export const classes = theme => ({
    link: {
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
    }
});

export class RawRss extends Component {
    state = {
        displayPages: 0
    };

    pseudoLoadData = (page) => this.setState({displayPages: page});

    render () {
        if (!this.props.data)
            return null;

        const items = this.props.data.slice(
            0, (this.state.displayPages + 1) * 10
        ).map(news => <ListItem button key={news.id}>
            <ListItemText
                className={this.props.classes.link}
                primary={<a href={news.href}>{news.title}</a>}
                secondary={this.props.intl.formatDate(news.date)}
                />
        </ListItem>);

        return <List className={this.props.containerClass}>
            <InfiniteScroll
                pageStart={0}
                loadMore={this.pseudoLoadData}
                hasMore={(this.state.displayPages + 1) * 10 < this.props.data.length}
                useWindow={false}
                >
            {items}
            </InfiniteScroll>
        </List>
    }

    componentDidMount() {
        this.props.startWidgetProcess({
            target: this.props.refreshWithoutAccount,
            interval: 300000,
            widget: this.props.uuid
        });
    }

    componentWillUnmount() {
        this.props.stopWidgetProcess({
            widget: this.props.uuid
        })
    }
}

const Rss = injectIntl(withStyles(classes)(RawRss));

Rss.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        href: PropTypes.string,
        title: PropTypes.string,
        date: PropTypes.string
    })),
    containerClass: PropTypes.string.isRequired,
    startWidgetProcess: PropTypes.func.isRequired,
    stopWidgetProcess: PropTypes.func.isRequired,
    refreshWithoutAccount: PropTypes.func.isRequired,
    uuid: PropTypes.string.isRequired
};

RawRss.propTypes = {
    ...Rss.propTypes,
    classes: PropTypes.object,
    intl: PropTypes.object
};

export default {
    Rss: Rss,
};

export const Forms = {
    Rss: RssForm
};
