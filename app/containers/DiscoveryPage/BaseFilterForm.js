import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-form';
import SelectField from 'components/Form/SelectField';
import Checkbox from 'components/Form/Checkbox';
import GenreTypes from 'constants/GenreTypes';
import PerformanceTypes from 'constants/PerformanceTypes';
import AmenityTypes from 'constants/AmenityTypes';
import { FormattedMessage } from 'react-intl';
import LocationSelect from 'components/AsyncSelect/LocationSelect';
import DateRangePicker from 'components/Calendar/DateRangePicker';
import { momentToLuxon } from 'utils/dates';
import Chevron from '@material-ui/icons/ExpandMore';
import FilterFormToggable from './FilterFormTogglable';
import messages from './messages';
import { shouldShowDefaultText } from './utils';

const RADIUS_OPTIONS = Object.freeze([
  {
    label: '50 miles',
    value: 50,
  },
  {
    label: '100 miles',
    value: 100,
  },
  {
    label: '250 miles',
    value: 250,
  },
  {
    label: '500 miles',
    value: 500,
  },
  {
    label: '> 500 miles',
    value: 1500,
  },
]);

const GENRE_OPTIONS = Object.keys(GenreTypes).map(optionKey => ({
  label: GenreTypes[optionKey],
  value: optionKey,
}));

const PERFORMANCE_OPTIONS = Object.keys(PerformanceTypes).map(optionKey => ({
  label: PerformanceTypes[optionKey],
  value: optionKey,
}));

const AMENITIES_OPTIONS = Object.keys(AmenityTypes).map(optionKey => ({
  label: AmenityTypes[optionKey],
  value: optionKey,
}));

const VIBES_OPTIONS = Object.keys(GenreTypes).map(optionKey => ({
  label: GenreTypes[optionKey],
  value: optionKey,
}));

const FilterPillContainer = styled.div`
  position: relative;
`;

const ExpandIcon = styled(Chevron)`
  position: absolute;
  top: 13%;
  right: 0px;
  z-index: 1;
`;

const FilterPill = styled.button`
  width: 95px;
  text-align: center;
  display: flex;
  align-items: center;

  cursor: pointer !important;
  text-align: center !important;
  ${({ isActive }) =>
    isActive ? `border: 2px solid rgb(34, 34, 34) !important;` : ''}
  outline: none !important;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
    'Helvetica Neue', sans-serif !important;
  position: relative !important;
  padding: 8px 16px !important;
  font-size: 12px !important;
  line-height: 16px !important;
  color: rgb(34, 34, 34) !important;
  font-weight: 500 !important;

  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  gap: 15px;
  height: 100%;
  position: relative;
`;

const RadiusSelect = styled(SelectField)`
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 12px !important;
  line-height: 16px !important;
  border: none;
`;

function BaseFilterForm({ activeProfileIsVenue, onChange, onChangeLocation }) {
  const defaultValues = useMemo(
    () => ({
      isVerified: true,
      genres: [],
      preferredPerformances: [],
      performanceTypes: [],
      amenities: [],
      availabilityBetween: [null, null],
    }),
    [],
  );

  const handleSubmit = () => {};

  const { Form, setFieldValue, values, reset } = useForm({
    defaultValues,
    validate: async newValues => {
      onChange(newValues);
    },
    onSubmit: async newValues => handleSubmit(newValues),
    debugForm: false,
  });

  const onChangeAvailability = (startDate, endDate) => {
    if (startDate && endDate) {
      setFieldValue('availabilityBetween', [
        momentToLuxon(startDate),
        momentToLuxon(endDate),
      ]);
    }
  };

  const genreTextKey = shouldShowDefaultText(
    values.performanceTypes,
    GENRE_OPTIONS,
  )
    ? 'Genre'
    : values.genres.join(',');

  const performanceTypesTextKey = shouldShowDefaultText(
    values.performanceTypes,
    PERFORMANCE_OPTIONS,
  )
    ? 'Type'
    : values.performanceTypes.join(',');

  const amenityTextKey = shouldShowDefaultText(
    values.amenities,
    AMENITIES_OPTIONS,
  )
    ? 'Amenities'
    : values.amenities.join(',');

  const preferredPerformancesTextKey = shouldShowDefaultText(
    values.preferredPerformances,
    VIBES_OPTIONS,
  )
    ? 'Vibes'
    : values.preferredPerformances.join(',');

  const verifiedIl8n = activeProfileIsVenue
    ? 'showVerifiedVenues'
    : 'showVerifiedArtists';

  return (
    <div>
      <Form>
        <FilterContainer>
          <LocationSelect
            showCitiesAndPlaces
            defaultValue="Tulsa, OK"
            onChange={onChangeLocation}
            style={{ zIndex: 100 }}
          />
          <div style={{ zIndex: 100 }}>
            <DateRangePicker onUpdate={onChangeAvailability} />
          </div>

          <RadiusSelect
            label={
              <span className="Truncate">
                <p className="no-wrap Truncate-text">Map radius</p>
              </span>
            }
            options={RADIUS_OPTIONS}
            name="mapRadius"
          />

          {activeProfileIsVenue && (
            <FilterFormToggable
              id="performance-toggle"
              LabelComponent={({ onClick }) => (
                <FilterPillContainer>
                  <ExpandIcon />
                  <FilterPill
                    isActive={values.performanceTypes.length > 0}
                    onClick={onClick}
                    className="ml-2 Truncate"
                    style={{ maxWidth: 150 }}
                    role="button"
                  >
                    <p className="Truncate-text"> {performanceTypesTextKey} </p>
                  </FilterPill>
                </FilterPillContainer>
              )}
            >
              <div className="p-2 d-flex flex-column">
                {PERFORMANCE_OPTIONS.map(performanceTypes => (
                  <Checkbox
                    isArray
                    field="performanceTypes"
                    className="mr-1"
                    value={performanceTypes.value}
                    type="checkbox"
                    label={performanceTypes.label}
                  />
                ))}
              </div>
            </FilterFormToggable>
          )}

          {!activeProfileIsVenue && (
            <FilterFormToggable
              id="amenities-toggle"
              LabelComponent={({ onClick }) => (
                <FilterPillContainer>
                  <ExpandIcon />
                  <FilterPill
                    isActive={values.amenities.length > 0}
                    onClick={onClick}
                    className="ml-2 Truncate"
                    style={{ maxWidth: 150 }}
                    role="button"
                  >
                    <p className="Truncate-text"> {amenityTextKey} </p>
                  </FilterPill>
                </FilterPillContainer>
              )}
            >
              <div className="p-2 d-flex flex-column">
                {AMENITIES_OPTIONS.map(amenities => (
                  <Checkbox
                    isArray
                    field="amenities"
                    className="mr-1"
                    value={amenities.value}
                    type="checkbox"
                    label={amenities.label.replace(/_/g, ' ')}
                  />
                ))}
              </div>
            </FilterFormToggable>
          )}

          {!activeProfileIsVenue && (
            <FilterFormToggable
              id="preferredPerformances-toggle"
              LabelComponent={({ onClick }) => (
                <FilterPillContainer>
                  <ExpandIcon />
                  <FilterPill
                    isActive={values.preferredPerformances.length > 0}
                    onClick={onClick}
                    className="ml-2 Truncate"
                    style={{ maxWidth: 150 }}
                    role="button"
                  >
                    <p className="Truncate-text">
                      {' '}
                      {preferredPerformancesTextKey}{' '}
                    </p>
                  </FilterPill>
                </FilterPillContainer>
              )}
            >
              <div className="p-2 d-flex flex-column">
                {VIBES_OPTIONS.map(preferredPerformances => (
                  <Checkbox
                    isArray
                    field="preferredPerformances"
                    className="mr-1"
                    value={preferredPerformances.value.replace(/_/g, ' ')}
                    type="checkbox"
                    label={preferredPerformances.label}
                  />
                ))}
              </div>
            </FilterFormToggable>
          )}
          {activeProfileIsVenue && (
            <FilterFormToggable
              id="genres-toggle"
              LabelComponent={({ onClick }) => (
                <FilterPillContainer>
                  <ExpandIcon />
                  <FilterPill
                    isActive={values.genres.length > 0}
                    onClick={onClick}
                    className="ml-2 Truncate"
                    style={{ maxWidth: 150 }}
                    role="button"
                  >
                    <p className="Truncate-text"> {genreTextKey} </p>
                  </FilterPill>
                </FilterPillContainer>
              )}
            >
              <div className="p-2 d-flex flex-column">
                {GENRE_OPTIONS.map(genre => (
                  <Checkbox
                    isArray
                    field="genres"
                    className="mr-1"
                    value={genre.value}
                    type="checkbox"
                    label={genre.label}
                  />
                ))}
              </div>
            </FilterFormToggable>
          )}

          <div className="p-4">
            <Checkbox
              field="isVerified"
              className="mr-1"
              type="checkbox"
              label={<FormattedMessage {...messages[verifiedIl8n]} />}
            />
          </div>
          <button
            type="button"
            className="color-primary no-wrap"
            onClick={() => {
              reset();
              onChange(defaultValues);
            }}
          >
            {' '}
            <FormattedMessage {...messages.resetFilters} />
          </button>
        </FilterContainer>
      </Form>
    </div>
  );
}

BaseFilterForm.propTypes = {
  activeProfileIsVenue: PropTypes.bool.isRequired,
  onChangeLocation: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(BaseFilterForm);
