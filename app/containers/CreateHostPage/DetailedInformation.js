import React, { useCallback, useMemo } from 'react';
import Button from 'components/Button';
import MultiSelectField from 'components/Form/MultiSelectField';
import Label from 'components/Form/Label';
import InputField from 'components/Form/InputField';
import TextField from 'components/Form/TextField';
import AmenityTypes from 'constants/AmenityTypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  PAGE_STEPS,
  Header,
  Headline,
  FormContainer,
  TextContainer,
} from './constants';
import messages from './messages';

function DetailedInformation({ setFieldValue, onPageChange, values, intl }) {
  const onExactCapacityUpdate = strMaxCapacity => {
    const maxCapacity = parseInt(strMaxCapacity);
    if (maxCapacity <= 20) return setFieldValue('capacity', 'INTIMATE');
    if (maxCapacity <= 60) return setFieldValue('capacity', 'SMALL');
    if (maxCapacity <= 120) return setFieldValue('capacity', 'MEDIUM');
    if (maxCapacity <= 300) return setFieldValue('capacity', 'LARGE');
    if (maxCapacity >= 300) return setFieldValue('capacity', 'VERY_LARGE');
  };

  const onNext = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    onPageChange(PAGE_STEPS.MEDIA_INFO);
  }, []);

  const onPrevious = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    onPageChange(PAGE_STEPS.BASIC_INFO);
  }, []);

  const AMENITY_OPTIONS = useMemo(
    () =>
      Object.keys(AmenityTypes).map(optionKey => ({
        label: intl.formatMessage(messages[AmenityTypes[optionKey]]),
        value: optionKey,
      })),
    [],
  );

  return (
    <div className="full-width d-flex flex-column flex-items-center">
      <Header>
        <Headline>The Basics</Headline>
        <TextContainer>
          Let’s start with the basics like, what is your name, stagename and
          contact info!
        </TextContainer>
      </Header>

      <FormContainer>
        <div className="d-flex flex-column my-2">
          <Label> What amenities does your venue provide? </Label>
          <MultiSelectField
            isMulti
            name="anemities"
            options={AMENITY_OPTIONS}
          />
        </div>

        <div className="d-flex flex-column my-2">
          <Label> What's your venue's max capacity?</Label>
          <InputField
            onUpdate={onExactCapacityUpdate}
            type="number"
            name="exactCapacity"
            className="my-1"
          />
        </div>

        <div className="d-flex flex-column my-2">
          <Label> Describe your venue </Label>
          <TextField
            placeholder="Tell me about your venue"
            required
            name="description"
            className="my-1"
          />
        </div>

        <div className="d-flex flex-row-reverse">
          <Button role="button" onClick={onNext}>
            <p className="f3">
              <FormattedMessage {...messages.next} />
            </p>
          </Button>

          <Button role="button" onClick={onPrevious}>
            <p className="f3">
              <FormattedMessage {...messages.previous} />
            </p>
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}

export default injectIntl(DetailedInformation);
