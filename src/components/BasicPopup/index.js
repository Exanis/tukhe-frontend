import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { defineMessages, injectIntl } from 'react-intl';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const messages = defineMessages({
    close: {
        id: 'composant.BasicPopup.close',
        defaultMessage: 'Close'
    }
});

export const RawDialogTitle = props => {
  const { children, classes, onClose } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label={props.intl.formatMessage(messages.close)} className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export const DialogTitle = injectIntl(withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(RawDialogTitle));

DialogTitle.propTypes = {
    onClose: PropTypes.func
};

export const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

export const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class BasicPopup extends Component {
    renderTitle = () => {
        if (!this.props.title)
            return null;
        return <DialogTitle onClose={this.props.onClose}>
            {this.props.title}
        </DialogTitle>;
    };

    renderActions = () => {
        if (!this.props.actions)
            return null;
        return <DialogActions>
            {this.props.actions}
        </DialogActions>;
    };

    render() {
        return <Dialog
            {...this.props}
            >
            {this.renderTitle()}
            <DialogContent>
                {this.props.children}
            </DialogContent>
            {this.renderActions()}
        </Dialog>;
    }
}

BasicPopup.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    actions: PropTypes.node,
};

export default BasicPopup;
