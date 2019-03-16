import React, {Component} from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import BasicPopup from '../../BasicPopup';

const messages = defineMessages({
    title: {
        id: 'component.main.AccountsList.title',
        defaultMessage: 'External accounts'
    },
    twitter: {
        id: 'component.main.AccountsList.provider.twitter',
        defaultMessage: 'Twitter'
    }
});

export class RawAccountsList extends Component {
    state = {
        anchorEl: null
    };

    menuAction = target => () => {
        this.setState({anchorEl: null});
        this.props.providers[target]();
    };

    deleteAccount = account => () => this.props.onDeleteAccount(account.uuid);
    onOpenMenu = ev => this.setState({anchorEl: ev.currentTarget});
    onCloseMenu = () => this.setState({anchorEl: null});

    render() {
        const accountsList = this.props.accounts.map(account => <TableRow key={account.uuid}>
            <TableCell>{this.props.intl.formatMessage(messages[account.provider])}</TableCell>
            <TableCell>{account.name}</TableCell>
            <TableCell>
                <Button color="secondary" variant="contained" onClick={this.deleteAccount(account)}>
                    <FormattedMessage
                        id={"component.main.AccountsList.delete"}
                        defaultMessage={"Delete"}
                        />
                </Button>
            </TableCell>
        </TableRow>);
        const addAccountList = Object.keys(this.props.providers).map(provider => <MenuItem key={provider} onClick={this.menuAction(provider)}>
                {this.props.intl.formatMessage(messages[provider])}
            </MenuItem>
        );
        const open = Boolean(this.state.anchorEl);

        return <BasicPopup
            title={this.props.intl.formatMessage(messages.title)}
            onClose={this.props.onClose}
            open={this.props.open}
            >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage
                                id={'component.main.AccountsList.provider'}
                                defaultMessage={'Service'}
                                />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage
                                id={'component.main.AccountsList.name'}
                                defaultMessage={'Name'}
                                />
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                aria-owns={open ? "add-account-menu" : undefined}
                                aria-haspopup="true"
                                onClick={this.onOpenMenu}
                            >
                                <FormattedMessage
                                    id={'component.main.AccountsList.name'}
                                    defaultMessage={'Add account'}
                                    />
                            </Button>
                            <Menu
                                id={'add-account-menu'}
                                anchorEl={this.state.anchorEl}
                                open={open}
                                onClose={this.onCloseMenu}
                                >
                                {addAccountList}
                            </Menu>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accountsList}
                </TableBody>
            </Table>
        </BasicPopup>
    }
}

const AccountsList = injectIntl(RawAccountsList);

AccountsList.propTypes = {
    accounts: PropTypes.arrayOf(
        PropTypes.shape({
            uuid: PropTypes.string.isRequired,
            provider: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onDeleteAccount: PropTypes.func.isRequired,
    providers: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

RawAccountsList.propTypes = {
    ...AccountsList.propTypes,
    intl: PropTypes.object
};

export default AccountsList;
