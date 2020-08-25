import React from "react";
import PropTypes from "prop-types";

export default function ErrorNotice(props) {
  const { message, clearError } = props;
  return (
    <div className="error-notice">
      <span>{message}</span>
      <button type="button" onClick={clearError}>
        X
      </button>
    </div>
  );
}

ErrorNotice.propTypes = {
  message: PropTypes.string,
  clearError: PropTypes.string,
};

ErrorNotice.defaultProps = {
  message: "",
  clearError: undefined,
};
