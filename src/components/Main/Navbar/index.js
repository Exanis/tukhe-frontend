import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from "react-intl";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';

import ConditionalComponent from '../../ConditionalComponent/index';

import MenuIcon from '@material-ui/icons/Menu';
import ExitIcon from '@material-ui/icons/ExitToApp';
import UnlockIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';
import CreateDashboard from '@material-ui/icons/CreateNewFolder';
import AccountBox from '@material-ui/icons/AccountBox';
import AddWidget from '@material-ui/icons/NoteAdd';

export default class Navbar extends Component {
    state = {
        anchorEl: null
    };

    onOpenMenu = ev => {
        this.setState({anchorEl: ev.currentTarget});
    };

    onCloseMenu = () => {
        this.setState({anchorEl: null});
    };

    menuAction = handler => () => {
        this.onCloseMenu();
        handler();
    };

    onSelectDashboard = dashboard => () => this.props.selectDashboard(dashboard.uuid);

    render () {
        const open = Boolean(this.state.anchorEl);
        const dashboards = this.props.dashboards.map(
            (dashboard) => <IconButton key={dashboard.uuid} color="inherit" onClick={this.onSelectDashboard(dashboard)}>
                <Icon fontSize={dashboard.uuid === this.props.current ? "large" : "small"}>{dashboard.icon}</Icon>
            </IconButton>
        );

        return <AppBar>
            <Toolbar>
                {dashboards}
                <div style={{flexGrow: 1}} />
                <ConditionalComponent render={this.props.editable}>
                    <IconButton
                        color="inherit"
                        onClick={this.props.onSaveLayout}
                        >
                        <SaveIcon/>
                    </IconButton>
                </ConditionalComponent>
                <IconButton
                    color="inherit"
                    aria-owns={open ? "app-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.onOpenMenu}
                    >
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id={"app-menu"}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    open={open}
                    onClose={this.onCloseMenu}
                    >
                    <MenuItem onClick={this.menuAction(this.props.onAddWidget)}>
                        <ListItemIcon>
                            <AddWidget/>
                        </ListItemIcon>
                        <FormattedMessage
                            id={'core.menu.createWidget'}
                            defaultMessage={'Add widget'}
                            />
                    </MenuItem>
                    <ConditionalComponent render={!this.props.editable}>
                        <MenuItem onClick={this.menuAction(this.props.onUnlock)}>
                            <ListItemIcon>
                                <UnlockIcon/>
                            </ListItemIcon>
                            <FormattedMessage id={'core.menu.unlock'} defaultMessage={'Unlock layout'} />
                        </MenuItem>
                    </ConditionalComponent>
                    <Divider/>
                    <MenuItem onClick={this.menuAction(this.props.createDashboard)}>
                        <ListItemIcon>
                            <CreateDashboard/>
                        </ListItemIcon>
                        <FormattedMessage
                            id={'core.menu.createDashboard'}
                            defaultMessage={'New dashboard'}
                            />
                    </MenuItem>
                    <Divider/>
                    <MenuItem
                        onClick={this.menuAction(this.props.onAccount)}>
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>

                        <FormattedMessage
                            id={'core.menu.account'}
                            defaultMessage={'Connected accounts'}
                            />
                    </MenuItem>
                    <MenuItem
                        onClick={this.menuAction(this.props.onLogout)}
                        >
                        <ListItemIcon>
                            <ExitIcon/>
                        </ListItemIcon>

                        <FormattedMessage
                            id={'core.menu.logout'}
                            defaultMessage={'Logout'}
                            />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    }
}

Navbar.propTypes = {
    selectDashboard: PropTypes.func.isRequired,
    dashboards: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
    })).isRequired,
    current: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    onAddWidget: PropTypes.func.isRequired,
    onUnlock: PropTypes.func.isRequired,
    createDashboard: PropTypes.func.isRequired,
    onAccount: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};
