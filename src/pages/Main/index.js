import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Navbar from '../../components/Main/Navbar';
import Dashboard from "../../components/Main/Dashboard/index";
import CreateDashboard from '../../components/Main/CreateDashboard';
import AccountsList from '../../components/Main/AccountsList';
import Catalog from '../../components/Main/Catalog';
import NewWidget from '../../components/Main/NewWidget';

import BasicPopup from '../../components/BasicPopup';

import {connect} from 'react-redux';
import user from '../../reducers/user';
import dashboard from '../../reducers/dashboard';
import {
    loadDashboards,
    createDashboard,
    selectDashboard,
    createWidget,
    updateDashboardLayout,
    refreshWidgetWithoutAccount,
    refreshWidgetWithAccount,
    widgetActionWithoutAccount,
    widgetActionWithAccount,
    startWidgetProcess,
    stopWidgetProcess
} from "../../actions/dashboard/index";
import {loadAccounts, deleteAccount, createTwitterAccount} from "../../actions/account/index";

export const styles = () => ({
    dashboard: {
        paddingTop: "65px",
        height: "calc(100% - 65px)"
    }
});

export class Main extends Component {
    state = {
        editable: false,
        displayCreateDashboard: false,
        displayAccountList: false,
        displayCatalog: false,
        createWidgetTarget: '',
        displayCreateWidget: false,
        layout: null,
        displayedDashboard: null,
        popupDisplayElement: null,
        popupProps: {}
    };

    displayElementInPopup = (el, props = {}) => this.setState({
        popupDisplayElement: el,
        popupProps: props
    });

    closeElementPopup = () => this.setState({
        popupDisplayElement: null,
        popupProps: {}
    });

    updatePopupProps = (newProps) => {
        this.setState({
            popupProps: {
                ...this.state.popupProps,
                ...newProps
            }
        });
    };

    createDashboard = (icon) => {
        this.props.createDashboard(icon);
        this.setState({displayCreateDashboard: false});
    };

    onSaveDashboardLayout = () => {
        this.props.updateDashboardLayout(this.state.layout);
        this.setState({editable: false});
    };

    unlockDashboard = () => this.setState({
        editable: true
    });
    onLayoutChange = layout => this.state.editable && this.setState({layout: layout});

    openCreateDashboard = () => this.setState({
        displayCreateDashboard: true
    });

    onCloseCreateDashboard = () => this.setState({displayCreateDashboard: false});

    createWidget = (provider, widget) => {
        this.setState({
            displayCatalog: false,
            createWidgetTarget: `${provider}_${widget}`,
            displayCreateWidget: true
        })
    };

    onCreateWidget = (result) => {
        this.props.createWidget(result);
        this.setState({
            displayCreateWidget: false
        });
    };
    onAddWidget = () => this.setState({displayCatalog: true});
    onCloseCatalog = () => this.setState({displayCatalog: false});
    onCloseNewWidget = () => this.setState({displayCreateWidget: false});

    onLogout = () => this.props.setToken(null);
    onAccount = () => this.setState({displayAccountList: true});

    onCloseAccountList = () => this.setState({displayAccountList: false});
    refreshLayoutState = layout => () => {
        this.setState({
            layout: layout,
            displayedDashboard: this.props.dashboard.currentDashboard
        });
    };

    render() {
        const providers = {
            'twitter': this.props.createTwitterAccount
        };
        const widgetsTypes = {
            'twitter': [
                'feed',
                'notifications'
            ],
            'misc': [
                'rss'
            ]
        };

        return <div className={this.props.classes.dashboard}>
            <Navbar
                editable={this.state.editable}
                onUnlock={this.unlockDashboard}
                onSaveLayout={this.onSaveDashboardLayout}
                selectDashboard={this.props.selectDashboard}
                createDashboard={this.openCreateDashboard}
                dashboards={this.props.dashboard.dashboards}
                current={this.props.dashboard.currentDashboard}
                onLogout={this.onLogout}
                onAccount={this.onAccount}
                onAddWidget={this.onAddWidget}
            />
            <CreateDashboard
                onClose={this.onCloseCreateDashboard}
                open={this.state.displayCreateDashboard}
                createDashboard={this.createDashboard}
            />
            <AccountsList
                onClose={this.onCloseAccountList}
                open={this.state.displayAccountList}
                accounts={this.props.account.accounts}
                onDeleteAccount={this.props.deleteAccount}
                providers={providers}
            />
            <Catalog
                onClose={this.onCloseCatalog}
                open={this.state.displayCatalog}
                widgets={widgetsTypes}
                onSelectWidget={this.createWidget}
            />
            <NewWidget
                onClose={this.onCloseNewWidget}
                open={this.state.displayCreateWidget}
                widget={this.state.createWidgetTarget}
                onCreateWidget={this.onCreateWidget}
                accounts={this.props.account.accounts}
            />
            <Dashboard
                editable={this.state.editable}
                widgets={this.props.dashboard.widgets}
                layout={this.state.layout}
                data={this.props.dashboard.data}
                refreshWithAccount={this.props.refreshWidgetWithAccount}
                refreshWithoutAccount={this.props.refreshWidgetWithoutAccount}
                onLayoutChange={this.onLayoutChange}
                displayElementInPopup={this.displayElementInPopup}
                closeElementPopup={this.closeElementPopup}
                widgetActionWithAccount={this.props.widgetActionWithAccount}
                widgetActionWithoutAccount={this.props.widgetActionWithoutAccount}
                updateWidgetData={this.props.updateWidgetData}
                updatePopupProps={this.updatePopupProps}
                startWidgetProcess={this.props.startWidgetProcess}
                stopWidgetProcess={this.props.stopWidgetProcess}
                addToWidgetData={this.props.addToWidgetData}
            />
            <BasicPopup
                onClose={this.closeElementPopup}
                open={Boolean(this.state.popupDisplayElement)}
                {...this.state.popupProps}
            >
                {this.state.popupDisplayElement}
            </BasicPopup>
        </div>
    }

    componentDidMount() {
        this.props.loadDashboards();
        this.props.loadAccounts();
    }

    componentDidUpdate() {
        if (this.props.dashboard.currentDashboard !== this.state.displayedDashboard) {
            const layout = this.props.dashboard.dashboards.find(
                dashboard => dashboard.uuid === this.props.dashboard.currentDashboard
            ).layout;

            setTimeout(this.refreshLayoutState(layout), 100); // Force re-rendering of layout otherwise there is a bug
        }
    }
}

export const mapStateToProps = state => {
    return {
        dashboard: state.dashboard,
        account: state.account,
    }
};

const mapDispatchToProps = {
    'setToken': user.actions.setToken,
    'updateWidgetData': dashboard.actions.updateWidgetData,
    'addToWidgetData': dashboard.actions.addToWidgetData,
    loadDashboards,
    createDashboard,
    selectDashboard,
    loadAccounts,
    deleteAccount,
    createTwitterAccount,
    createWidget,
    updateDashboardLayout,
    refreshWidgetWithoutAccount,
    refreshWidgetWithAccount,
    widgetActionWithAccount,
    widgetActionWithoutAccount,
    startWidgetProcess,
    stopWidgetProcess
};

Main.propTypes = {
    'setToken': PropTypes.func.isRequired,
    'updateWidgetData': PropTypes.func.isRequired,
    'addToWidgetData': PropTypes.func.isRequired,
    loadDashboards: PropTypes.func.isRequired,
    createDashboard: PropTypes.func.isRequired,
    selectDashboard: PropTypes.func.isRequired,
    loadAccounts: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    createTwitterAccount: PropTypes.func.isRequired,
    createWidget: PropTypes.func.isRequired,
    updateDashboardLayout: PropTypes.func.isRequired,
    refreshWidgetWithoutAccount: PropTypes.func.isRequired,
    refreshWidgetWithAccount: PropTypes.func.isRequired,
    widgetActionWithAccount: PropTypes.func.isRequired,
    widgetActionWithoutAccount: PropTypes.func.isRequired,
    startWidgetProcess: PropTypes.func.isRequired,
    stopWidgetProcess: PropTypes.func.isRequired,
    dashboard: PropTypes.object,
    account: PropTypes.object
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Main));
