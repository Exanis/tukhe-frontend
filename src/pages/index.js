import React, {Component} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import logo from './logo.png';

import Login from './Login';
import Auth from './Auth';
import Main from './Main';

class DisconnectedProtectedRoute extends Component {
    render() {
        const { Page, user, ...rest } = this.props;

        if (user.token === null)
            return <Redirect
                        to={{
                            pathname: '/login',
                            state: {
                                from: this.props.location
                            }
                        }}
                    />;

        return <Route {...rest} component={Page} />;
    }
}

class DisconnectedUnprotectedRoute extends Component {
    render() {
        const { Page, user, ...rest } = this.props;

        if (user.token !== null)
            return <Redirect
                        to={{
                            pathname: '/',
                            state: {
                                from: this.props.location
                            }
                        }}
                    />;
        return <Route {...rest} component={Page} />;
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const ProtectedRoute = connect(mapStateToProps)(DisconnectedProtectedRoute);
const UnprotectedRoute = connect(mapStateToProps)(DisconnectedUnprotectedRoute);

const styles = theme => ({
    root: {
        backgroundColor: "#f5f5f5",
        height: "100%",
        backgroundImage: `url(${logo})`,
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat"
    }
});

export class App extends Component {
    render() {
        const { classes } = this.props;

        return <div className={classes.root}>
            <Switch>
                <ProtectedRoute exact path={'/'} Page={Main} />
                <UnprotectedRoute exact path='/login' Page={Login} />
                <Route exact path='/auth' component={Auth} />
            </Switch>
        </div>
    };
}

export default withStyles(styles)(App);