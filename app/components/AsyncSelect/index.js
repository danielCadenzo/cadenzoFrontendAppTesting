/* eslint-disable consistent-return */
/**
 *
 * AsyncSelect
 *
 */

// import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
function Asynchronous(props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [internalOptions, setInternalOptions] = React.useState([]);
  const {
    options,
    onSearchChange,
    onChange,
    label,
    variant,
    placeholder,
    clearOnSelect,
    value,
  } = props;

  const handleSearchResultsFufilled = newOptions => {
    setLoading(false);
    setInternalOptions(newOptions);
  };

  const handleOnChange = evnt => {
    if (!evnt) return null;
    const {
      target: { attributes },
    } = evnt;
    let { value: selectedIndex } = attributes.getNamedItem('data-option-index');
    selectedIndex = Number(selectedIndex);
    const deferredOptions = options || internalOptions;
    if (selectedIndex !== -1) {
      onChange(deferredOptions[selectedIndex]);
      if (clearOnSelect) {
        onChange(null);
      }
    }
  };

  const handleSearchChange = evt => {
    setLoading(true);
    onSearchChange(evt, handleSearchResultsFufilled);
  };

  return (
    <Autocomplete
      style={{ width: 300 }}
      open={open}
      value={value}
      onOpen={() => {
        handleSearchChange(null, setLoading);
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      data-test-id="async-select"
      getOptionSelected={(option, newOption) =>
        newOption !== null && option.value === newOption.value
      }
      getOptionLabel={option => option.label}
      onChange={handleOnChange}
      clearOnBlur={clearOnSelect}
      clearOnEscape={clearOnSelect}
      options={options || internalOptions}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          onChange={handleSearchChange}
          clearOnBlur={clearOnSelect}
          variant={variant}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

Asynchronous.propTypes = {
  clearOnSelect: PropTypes.func,
  onSearchChange: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.array,
  variant: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
};

Asynchronous.defaultProps = {
  clearOnSelect: true,
};

export default Asynchronous;
