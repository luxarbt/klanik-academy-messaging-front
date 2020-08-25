import React from "react";
import PropTypes from "prop-types";

export default function Filter({ value, handleChange }) {
  return (
    <div>
      filter: <input value={value} onChange={handleChange} />
    </div>
  );
}

Filter.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
};

Filter.defaultProps = {
  value: "",
  handleChange: () => {},
};
