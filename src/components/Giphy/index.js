import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Selector } from "react-giphy-selector";

export const classes = theme => ({

});


export class RawGiphy extends Component {
    onGifSelected = ev => this.props.onGifSelected(ev.images.original.gif_url);

    render () {
        return <Selector
                    apiKey={process.env.REACT_APP_GIPHY_KEY}
                    onGifSelected={this.onGifSelected} />;
    }
}

const Giphy = withStyles(classes)(RawGiphy);

Giphy.propTypes = {
    onGifSelected: PropTypes.func
};

RawGiphy.propTypes = {
    ...Giphy.propTypes,
    classes: PropTypes.object
};

export default Giphy;
