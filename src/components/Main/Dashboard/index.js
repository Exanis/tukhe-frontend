import React, {Component} from 'react';
import BaseGrid, { WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import ConditionalComponent from '../../ConditionalComponent';
import Widgets from '../../Widget';

const GridLayout = WidthProvider(BaseGrid);

export const styles = () => ({
    container: {
        height: "100%",
        width: "100%",
        overflow: "auto"
    },
    widget: {
        height: "100%"
    },
    widgetContainer: {
        height: "calc(100% - 25px)",
        overflow: "auto"
    },
    headerTitle: {
        flex: 1
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const widgets = {
    'twitter_feed': Widgets.Twitter.Feed,
    'twitter_notifications': Widgets.Twitter.Notifications,
    'misc_rss': Widgets.Misc.Rss,
};

export class RawDashboard extends Component {
    state = {
        widgetActions: {}
    };

    actionWithAccount = (uuid) => (action, data, callback = null) => {
        const payload = {
            'widget': uuid,
            'action': action,
            'params': data,
            'callback': callback
        };

        this.props.widgetActionWithAccount(payload);
    };

    actionWithoutAccount = (uuid) => (action, data, callback = null) => {
        const payload = {
            'widget': uuid,
            'action': action,
            'params': data,
            'callback': callback
        };

        this.props.widgetActionWithoutAccount(payload);
    };

    updateElement = (widget) => (select, update) => this.props.updateWidgetData({
        'widget': widget,
        'select': select,
        'update': update
    });

    addElement = (widget) => (elements) => this.props.addToWidgetData({
        widget: widget,
        elements: elements
    });

    setWidgetActions = (widget) => (actions) => {
        const newWidgetAction = this.state.widgetActions;

        newWidgetAction[widget] = actions;
        this.setState({
            widgetActions: newWidgetAction
        })
    };

    refreshWithAccount = uuid => () => this.props.refreshWithAccount(uuid);
    refreshWithoutAccount = uuid => () => this.props.refreshWithoutAccount(uuid);

    renderWidget = (widget) => {
        const WidgetType = widgets[widget.type];
        const display = <WidgetType
            data={this.props.data[widget.uuid]}
            refreshWithAccount={this.refreshWithAccount(widget.uuid)}
            refreshWithoutAccount={this.refreshWithoutAccount(widget.uuid)}
            actionWithAccount={this.actionWithAccount(widget.uuid)}
            actionWithoutAccount={this.actionWithoutAccount(widget.uuid)}
            updateElement={this.updateElement(widget.uuid)}
            displayElementInPopup={this.props.displayElementInPopup}
            closeElementPopup={this.props.closeElementPopup}
            containerClass={this.props.classes.widgetContainer}
            uuid={widget.uuid}
            updatePopupProps={this.props.updatePopupProps}
            updateWidgetActions={this.setWidgetActions(widget.uuid)}
            startWidgetProcess={this.props.startWidgetProcess}
            stopWidgetProcess={this.props.stopWidgetProcess}
            addToWidgetData={this.addElement(widget.uuid)}
            />;

        return <Card key={widget.uuid} id={widget.uuid}>
            <CardContent className={this.props.classes.widget}>
                <ConditionalComponent render={widget.header || this.props.editable}>
                    <Typography color="textSecondary" gutterBottom className={this.props.classes.header}>
                        <div className={this.props.classes.headerTitle}>
                            {widget.title}
                        </div>
                        {this.state.widgetActions[widget.uuid]}
                    </Typography>
                </ConditionalComponent>
                {display}
            </CardContent>
        </Card>;
    };

    onLayoutChange = layout => this.props.onLayoutChange(layout);

    render () {
        if (this.props.layout === null)
            return null;
        const widgets = this.props.widgets.map(this.renderWidget);

        return <div className={this.props.classes.container}>
            <GridLayout
                isDraggable={this.props.editable}
                isResizable={this.props.editable}
                compactType={'vertical'}
                layout={this.props.layout}
                onLayoutChange={this.onLayoutChange}
                >
                {widgets}
            </GridLayout>
        </div>;
    }
}

const Dashboard = withStyles(styles)(RawDashboard);

Dashboard.propTypes = {
    widgetActionWithAccount: PropTypes.func.isRequired,
    widgetActionWithoutAccount: PropTypes.func.isRequired,
    updateWidgetData: PropTypes.func.isRequired,
    addToWidgetData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    refreshWithAccount: PropTypes.func.isRequired,
    refreshWithoutAccount: PropTypes.func.isRequired,
    displayElementInPopup: PropTypes.func.isRequired,
    closeElementPopup: PropTypes.func.isRequired,
    updatePopupProps: PropTypes.func.isRequired,
    startWidgetProcess: PropTypes.func.isRequired,
    stopWidgetProcess: PropTypes.func.isRequired,
    onLayoutChange: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired,
    widgets: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        type: PropTypes.string,
        header: PropTypes.bool,
        title: PropTypes.string
    })).isRequired,
    layout: PropTypes.object
};

RawDashboard.propTypes = {
    ...Dashboard.propTypes,
    classes: PropTypes.object
};

export default Dashboard
