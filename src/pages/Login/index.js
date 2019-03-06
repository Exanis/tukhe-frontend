import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { FormattedMessage } from "react-intl";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {twitterLogin} from "../../actions/login";

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop: "5%",
        textAlign: "justify",
        marginLeft: "20px",
        marginRight: "20px"
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center'
    },
    smallLeap: {
        marginBottom: "20px"
    },
    bigLeap: {
        marginBottom: "50px"
    },
    socialButton: {
        padding: theme.spacing.unit
    },
    twitter: {
        backgroundColor: "#00aced",
        color: "white"
    }
});

export class Login extends Component {
    render() {
        const { classes } = this.props;

        return <div className={classes.root}>
            <Grid container spacing={40}>
                <Grid item xs={1} />
                <Grid item xs={7}>
                    <Typography variant={"h3"} className={classes.smallLeap}>
                        <FormattedMessage
                            id={'login.description.title'}
                            defaultMessage={'All your news and networks - in one place.'}
                            />
                    </Typography>
                    <Typography variant={"h5"} className={classes.bigLeap}>
                        <FormattedMessage
                            id={'login.description.content'}
                            defaultMessage={'Facebook, Twitter, Instagram, some news feeds... Hard to manage everything, sometime with multiple accounts? We got your back! All of your needs in one single tool, highly customizable.'}
                            />
                    </Typography>
                    <Typography variant={"h4"}>
                        <FormattedMessage
                            id={'login.free'}
                            defaultMessage={'Give it a try - it\'s free!'}
                            />
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <Typography variant={'h5'} className={classes.smallLeap}>
                            <FormattedMessage
                                id={'login.button.title'}
                                defaultMessage={'Connect to Tukhe'}
                                />
                        </Typography>
                        <Button className={`${classes.socialButton} ${classes.twitter}`} onClick={this.props.twitterLogin}>
                            <FormattedMessage
                                id={'login.button.twitter'}
                                defaultMessage={'Login with Twitter'}
                                />
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = {
    twitterLogin
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Login));