import React, { useCallback } from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import MultiSelectField from 'components/Form/MultiSelectField';
import Label from 'components/Form/Label';
import Checkbox from 'components/Form/Checkbox';
import Genres from 'constants/GenreTypes';
import PerformanceTypes from 'constants/PerformanceTypes';
import { FormattedMessage } from 'react-intl';
import TextField from 'components/Form/TextField';
import messages from './messages';
import { PAGE_STEPS } from './constants';

const Header = styled.div`
  background-color: black;
  background: linear-gradient(93.34deg, #5926cc 0%, #a84bf5 100%);
  width: 100%;
  /* height: 200px; */
  margin-bottom: -60px;
  /* box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4); */
  background-size: auto;
  background-position: center;
  color: white !important;
  padding: 80px 20px 120px 20px !important;
`;

const Headline = styled.h2`
  font-style: normal;
  font-weight: bold;
  font-size: 72px;
  line-height: 84px;
  letter-spacing: -0.02em;
  color: #ffffff;
`;

const FormContainer = styled.div`
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);

  .prevButton {
    order: 1;
  }

  .nextButton {
    order: 2;
  }
`;

const TextContainer = styled.p`
  max-width: min(500px, 100%);
`;

const GENRE_OPTIONS = Object.keys(Genres).map(key => ({
  label: Genres[key],
  value: key,
}));

const PERFORMANCE_OPTIONS = Object.keys(PerformanceTypes).map(key => ({
  label: PerformanceTypes[key],
  value: key,
}));

function DetailedInformation({ onPageChange }) {
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
  return (
    <div>
      <Header className="full-width">
        <Headline>A bit more detail</Headline>
        <TextContainer>
          Cool! We got your basics now tell us a little about your artistry.
        </TextContainer>
      </Header>

      <div className="d-flex flex-justify-center">
        <FormContainer>
          <div className="d-flex flex-column my-2">
            <Label>
              <FormattedMessage {...messages.artToPerform} />{' '}
            </Label>
            <MultiSelectField
              isMulti
              name="performanceTypes"
              options={PERFORMANCE_OPTIONS}
            />
          </div>

          <div className="d-flex flex-column my-2">
            <Label>
              <FormattedMessage {...messages.genreDoYouPlay} />
            </Label>
            <MultiSelectField isMulti name="genres" options={GENRE_OPTIONS} />
          </div>

          <div className="d-flex flex-column my-2">
            <Checkbox
              label={<FormattedMessage {...messages.isBand} />}
              field="isBand"
            />
          </div>

          <div className="d-flex flex-column my-2">
            <Label>
              <FormattedMessage {...messages.artistBio} />{' '}
            </Label>
            <TextField required name="description" className="my-1" />
          </div>

          <div className="full-width d-flex flex-justify-between ">
            <Button className="nextButton" role="button" onClick={onNext}>
              {' '}
              Next{' '}
            </Button>
            <Button className="prevButton" role="button" onClick={onPrevious}>
              {' '}
              Previous{' '}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}

export default DetailedInformation;
