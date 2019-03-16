import React, {Component} from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import BasicPopup from '../../BasicPopup';

const messages = defineMessages({
    title: {
        id: 'composant.main.CreateDashboard.title',
        defaultMessage: 'Pick an icon to create a dashboard'
    }
});

export class RawCreateDashboard extends Component {
    onCreateDashboard = icon => () => this.props.createDashboard(icon);

    render() {
        const possibleIcons = [
            'home',
            'business',
            'mail_outline',
            'message',
            'bookmarks',
            'face',
            'favorite',
            'favorite_border',
            'feedback',
            'info',
            'language',
            'pan_tool',
            'pets',
            'shopping_cart',
            'supervisor_account',
            'visibility',
            'watch_later',
            'work',
            'directions_walk',
            'my_location',
            'mood',
            'cake',
            'public',
            'star',
        ];
        const gridIcons = possibleIcons.map((icon) => <GridListTile key={icon}>
            <IconButton onClick={this.onCreateDashboard(icon)}>
                <Icon>{icon}</Icon>
            </IconButton>
        </GridListTile>);

        return <BasicPopup
            title={this.props.intl.formatMessage(messages.title)}
            onClose={this.props.onClose}
            open={this.props.open}
            >
            <GridList cellHeight={48} cols={8}>
                {gridIcons}
            </GridList>
        </BasicPopup>
    }
}

const CreateDashboard = injectIntl(RawCreateDashboard);

CreateDashboard.propTypes = {
    createDashboard: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

RawCreateDashboard.propTypes = {
    ...CreateDashboard.propTypes,
    intl: PropTypes.object
};

export default CreateDashboard;
