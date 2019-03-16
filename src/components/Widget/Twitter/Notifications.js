import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import InfiniteScroll from 'react-infinite-scroller';
import Tweet from './Tweet';

export default class Notifications extends Component {
    state = {
        displayPages: 0
    };

    pseudoLoadData = (page) => this.setState({displayPages: page});

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
        </List>
    }

    componentDidMount() {
        this.props.startWidgetProcess({
            target: this.props.refreshWithAccount,
            interval: 21000,
            widget: this.props.uuid
        });
    }

    componentWillUnmount() {
        this.props.stopWidgetProcess({
            widget: this.props.uuid
        })
    }
}

Notifications.propTypes = {
    data: PropTypes.array,
    updateElement: PropTypes.func.isRequired,
    actionWithAccount: PropTypes.func.isRequired,
    displayElementInPopup: PropTypes.func.isRequired,
    updatePopupProps: PropTypes.func.isRequired,
    containerClass: PropTypes.string,
    startWidgetProcess: PropTypes.func.isRequired,
    refreshWithAccount: PropTypes.func.isRequired,
    stopWidgetProcess: PropTypes.func.isRequired
};
