import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, Switch, Redirect, withRouter} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { sessionLogin } from "../actions/login/index";

import logo from './logo.png';

import Login from './Login';
import Auth from './Auth';
import Main from './Main';

export class DisconnectedProtectedRoute extends Component {
    render() {
        const { Page, user, ...rest } = this.props;

        if (user.token === null) {
            return <Redirect
                to={{
                    pathname: '/login',
                    state: {
                        from: this.props.location
                    }
                }}
            />;
        }

        return <Route {...rest} component={Page} />;
    }
}

export class DisconnectedUnprotectedRoute extends Component {
    render() {
        const { Page, user, ...rest } = this.props;

        if (user.token !== null) {
            return <Redirect
                to={{
                    pathname: '/',
                    state: {
                        from: this.props.location
                    }
                }}
            />;
        }
        return <Route {...rest} component={Page} />;
    }
}

export const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const ProtectedRoute = withRouter(connect(mapStateToProps)(DisconnectedProtectedRoute));
const UnprotectedRoute = withRouter(connect(mapStateToProps)(DisconnectedUnprotectedRoute));

ProtectedRoute.propTypes = {
    location: PropTypes.object,
    Page: PropTypes.func
};
DisconnectedProtectedRoute.propTypes = {
    ...ProtectedRoute.propTypes,
    user: PropTypes.object
};
UnprotectedRoute.propTypes = {
    location: PropTypes.object,
    Page: PropTypes.func
};
DisconnectedUnprotectedRoute.propTypes = {
    ...ProtectedRoute.propTypes,
    user: PropTypes.object
};

export const styles = theme => ({
    root: {
        backgroundImage: `url(${logo})`,
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat"
    }
});

export class RawApp extends Component {
    render() {
        const { classes } = this.props;

        if (this.props.user.token === false)
            return <div />;

        return <div className={classes.root}>
            <CssBaseline/>
            <Switch>
                <ProtectedRoute exact path={'/'} Page={Main} />
                <UnprotectedRoute exact path='/login' Page={Login} />
                <Route exact path='/auth' component={Auth} />
            </Switch>
        </div>
    };

    componentDidMount() {
        this.props.sessionLogin();
    }
}

const mapDispatchToProps = {
    sessionLogin
};

const App = withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RawApp)));

App.propTypes = {};
RawApp.propTypes = {
    ...App.propTypes,
    classes: PropTypes.object,
    user: PropTypes.object
};

export default App;
