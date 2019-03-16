import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import BasicPopup from '../../BasicPopup';
import ConditionalComponent from "../../ConditionalComponent/index";

import { Forms } from '../../Widget';

const messages = defineMessages({
    title: {
        id: 'component.main.NewWidget.title',
        defaultMessage: 'Add a widget'
    },
    widgetTitle: {
        id: 'component.main.NewWidget.widgetTitle',
        defaultMessage: 'Widget title'
    },
    displayWidgetTitle: {
        id: 'component.main.NewWidget.displayWidgetTitle',
        defaultMessage: 'Display widget title'
    },
    twitter: {
        id: 'component.main.NewWidget.provider.twitter',
        defaultMessage: 'Twitter'
    }
});

export class RawNewWidget extends Component {
    state = {
        step: 0,
        title: '',
        displayTitle: true,
        accounts: [],
        config: {}
    };

    onTitleChange = ev => this.setState({title: ev.target.value});
    onDisplayTitleChange = ev => this.setState({displayTitle: ev.target.checked});

    renderBaseForm = () => <div>
        <TextField
            id='widget-title'
            label={this.props.intl.formatMessage(messages.widgetTitle)}
            value={this.state.title}
            onChange={this.onTitleChange}
            fullWidth
            /><br />
        <FormControlLabel
            control={
                <Switch
                    checked={this.state.displayTitle}
                    onChange={this.onDisplayTitleChange}
                    value="displayTitle"
                    />
            }
            label={this.props.intl.formatMessage(messages.displayWidgetTitle)}
            />
    </div>;

    addRemoveAccount = (account, multiple) => () => {
        if (this.state.accounts.indexOf(account) !== -1)
            this.setState({accounts: this.state.accounts.filter(acc => acc !== account)});
        else if (multiple)
            this.setState({accounts: [account, ...this.state.accounts]});
        else
            this.setState({accounts: [account]});
    };

    renderAccountForm = widget => {
        const accounts = this.props.accounts.filter(account => account.provider === widget.account).map(
            account => <ListItem
                key={account.uuid}
                button
                onClick={this.addRemoveAccount(account.uuid, widget.multipleAccounts)}
            >
                <Checkbox
                    checked={this.state.accounts.indexOf(account.uuid) !== -1}
                    tabIndex={-1}
                    disableRipple
                />
                <ListItemText
                    primary={account.name}
                    secondary={this.props.intl.formatMessage(messages[account.provider])}
                />
            </ListItem>
        );
        return <List>
            {accounts}
        </List>
    };

    renderWidgetForm = widget => widget.form;

    onCreateWidget = () => {
        const result = {
            title: this.state.title,
            header: this.state.displayTitle,
            type: this.props.widget,
            accounts: this.state.accounts,
            config: this.state.config
        };

        this.props.onCreateWidget(result);
    };

    onConfigUpdate = (config) => this.setState({config: config});
    onPrevStep = prevStep => () => this.setState({step: prevStep});
    onNextStep = nextStep => () => this.setState({step: nextStep});

    render() {
        const widgetConfiguration = {
            'twitter_feed': {
                'account': 'twitter',
                'multipleAccounts': false,
                'form': null
            },
            'twitter_notifications': {
                'account': 'twitter',
                'multipleAccounts': false,
                'form': null
            },
            'misc_rss': {
                'account': false,
                'multipleAccounts': false,
                'form': <Forms.Misc.Rss
                    config={this.state.config}
                    onConfigUpdate={this.onConfigUpdate}
                    />
            }
        };
        const widget = widgetConfiguration[this.props.widget];

        if (!widget)
            return null;

        const finalStep = widget['form'] ? 2 : widget['account'] ? 1 : 0;
        const nextStep = this.state.step === 0 ? (widget['account'] ? 1 : 2) : 2;
        const prevStep = this.state.step === 2 && widget['account'] ? 1 : 0;

        const actions = [
            <ConditionalComponent render={this.state.step !== 0} key='prev'>
                <Button onClick={this.onPrevStep(prevStep)}>
                    <FormattedMessage
                        id={'component.main.NewWidget.back'}
                        defaultMessage={'Back'}
                        />
                </Button>
            </ConditionalComponent>,
            <ConditionalComponent render={this.state.step === finalStep} key='done'>
                <Button onClick={this.onCreateWidget} variant={'contained'} color={'primary'}>
                    <FormattedMessage
                        id={'component.main.NewWidget.create'}
                        defaultMessage={'Create'}
                        />
                </Button>
            </ConditionalComponent>,
            <ConditionalComponent render={this.state.step !== finalStep} key='next'>
                <Button onClick={this.onNextStep(nextStep)} variant={'contained'} color={'primary'}>
                    <FormattedMessage
                        id={'component.main.NewWidget.next'}
                        defaultMessage={'Next'}
                        />
                </Button>
            </ConditionalComponent>
        ];

        return <BasicPopup
            title={this.props.intl.formatMessage(messages.title)}
            onClose={this.props.onClose}
            open={this.props.open}
            actions={actions}
            >
            <Stepper activeStep={this.state.step}>
                <Step>
                    <StepLabel>
                        <FormattedMessage
                            id={'component.main.NewWidget.step.1'}
                            defaultMessage={'Configure layout'}
                            />
                    </StepLabel>
                </Step>
                <Step completed={!Boolean(widget['account'])}>
                    <StepLabel>
                        <FormattedMessage
                            id={'component.main.NewWidget.step.2'}
                            defaultMessage={'Select account(s)'}
                            />
                    </StepLabel>
                </Step>
                <Step completed={!Boolean(widget['form'])}>
                    <StepLabel>
                        <FormattedMessage
                            id={'component.main.NewWidget.step.3'}
                            defaultMessage={'Configure widget'}
                            />
                    </StepLabel>
                </Step>
            </Stepper>
            { this.state.step === 0 && this.renderBaseForm() }
            { this.state.step === 1 && this.renderAccountForm(widget) }
            { this.state.step === 2 && this.renderWidgetForm(widget) }
        </BasicPopup>
    }
}

const NewWidget = injectIntl(RawNewWidget);

NewWidget.propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        provider: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    widget: PropTypes.string.isRequired,
    onCreateWidget: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
RawNewWidget.propTypes = {
    ...NewWidget.propTypes,
    intl: PropTypes.object
};

export default NewWidget;
