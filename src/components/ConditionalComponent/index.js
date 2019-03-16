import PropTypes from 'prop-types';

const ConditionalComponent = function (props) {
    if (!props.render)
        return null;

    return props.children;
};

ConditionalComponent.propTypes = {
    render: PropTypes.bool.isRequired
};

export default ConditionalComponent;
