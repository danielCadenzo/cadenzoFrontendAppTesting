/* eslint-disable consistent-return */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { createGQLQuery } from 'data/api';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const getLocationQuery = showCities => `query($address: String!){
  getAddresses(rawAddress: $address, showCities: ${showCities})
}`;

const getLocationDetail = `query ($placeId: String!){
  getAddressDetail(placeId: $placeId) {
    raw
    formatted
    latitude
    longitude
  }
}`;

export default function GoogleMapsSelect({
  onChange,
  defaultValue = null,
  showCities = false,
  onFetchPlaceDetail,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultValue);
  const [inputValue, setInputValue] = React.useState(defaultValue);
  const [options, setOptions] = React.useState([]);
  const [placeDetails, setPlaceDetails] = React.useState(null);

  const onPlaceSelected = React.useCallback(
    newValue => {
      if (newValue && newValue.place_id)
        createGQLQuery(getLocationDetail, {
          placeId: newValue.place_id,
        }).then(data => {
          const { getAddressDetail } = data;
          setPlaceDetails(getAddressDetail);
          if (onFetchPlaceDetail) onFetchPlaceDetail(getAddressDetail);
        });
    },
    [value, onFetchPlaceDetail, setPlaceDetails],
  );

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }
    createGQLQuery(getLocationQuery(showCities), {
      address: inputValue || '',
    }).then(data => {
      const { getAddresses } = data;
      const predictions = JSON.parse(getAddresses);
      setOptions(predictions || []);
      onPlaceSelected(value);
    });
  }, [value, inputValue]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: 300 }}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={x => x}
      options={options}
      getOptionSelected={(option, selectedValue) =>
        option.description === selectedValue.description
      }
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        onChange(newValue.description, newValue);
        if (onFetchPlaceDetail) {
          onFetchPlaceDetail();
        }
        setValue(newValue);
        onPlaceSelected(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={params => (
        <TextField {...params} label="Location" variant="outlined" fullWidth />
      )}
      renderOption={option => (
        <Grid container alignItems="center">
          <Grid item>
            <LocationOnIcon className={classes.icon} />
          </Grid>
          <Grid item xs>
            {option.structured_formatting.main_text}
            <Typography variant="body2" color="textSecondary">
              {option.structured_formatting.secondary_text}
            </Typography>
          </Grid>
        </Grid>
      )}
    />
  );
}

GoogleMapsSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};
