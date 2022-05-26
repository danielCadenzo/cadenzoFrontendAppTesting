import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-form';
import { pick } from 'lodash';
import { componentFromType } from 'components/Form/utils';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import ArtistReviewSchema from './artist_review_schema';
import VenueReviewSchema from './venue_review_schema';
import PostShowSurvey from './post_show_survey_schema';

const CUSTOM_PROPS = ['options', 'label', 'value', 'name'];

function renderFormFromSchema(field) {
  const Component = componentFromType(field.type);
  const props = pick(field, CUSTOM_PROPS);
  return (
    <>
      <Label className="pt-3"> {field.label} </Label>
      <Component {...props} className="full-width pb-3" />
    </>
  );
}

function ReviewForm({ urlParams }) {
  const defaultValues = useMemo(
    () => ({
      overallRating:
        (urlParams.overall_rating && parseInt(urlParams.overall_rating, 10)) ||
        -1,
    }),
    [],
  );

  const formToUse = useMemo(() => {
    switch (urlParams.formType) {
      case 'venueReview':
        return VenueReviewSchema;
      case 'artistReview':
        return ArtistReviewSchema;
      case 'postShowSurvey':
        return PostShowSurvey;
      default:
        return VenueReviewSchema;
    }
  });
  const { fields } = formToUse;
  const { Form } = useForm({
    defaultValues,
    onSubmit: () => {},
  });
  return (
    <Form
      style={{ maxWidth: '90%' }}
      className="d-flex flex-column flex-items-center flex-justify-center text-center mx-auto"
    >
      {fields.map(field => renderFormFromSchema(field))}
      <Button type="submit" className="d-block h3 py-4 full-width">
        {' '}
        Submit{' '}
      </Button>
    </Form>
  );
}

ReviewForm.propTypes = {
  form: PropTypes.shape({
    fields: PropTypes.array,
  }),
};

ReviewForm.defaultProps = {};

export default ReviewForm;
