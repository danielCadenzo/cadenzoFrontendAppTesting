'use es6';

import React, { useCallback, useState, Fragment } from 'react';
import styled from 'styled-components';
import SideNav from 'components/SideNav';
import { FormattedMessage } from 'react-intl';
import H2 from 'components/H2';
import EventBasicsForm from './EventBasicsForm';
import { midgreen } from '../../utils/CssVariables';
import messages from './messages';

const EventCreationSteps = Object.freeze({
  EVENT_DETAILS: 1,
  // TICKET_SETUP: 2,
});

const Wrapper = styled.div`
  max-height: calc(100% - 60px);
  overflow: hidden;
`;

const Stepper = styled.div`
  border-radius: 50%;
  display: flex;
  place-items: center;
  text-align: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border: 2px solid ${midgreen};
  padding: 8px;
  color: ${({ activeStep, step }) => (activeStep >= step ? 'white' : midgreen)};
  background-color: ${({ activeStep, step }) =>
    activeStep >= step ? midgreen : 'white'};
`;

const StepConnector = styled.div`
  width: 100px;
  height: 10px;
  background-color: transparent;
  align-self: center;
`;

function CreateEventPage(props) {
  const [activeStep, setActiveStep] = useState(1);

  const stepForward = useCallback(() => {
    setActiveStep(activeStep + 1);
  }, []);

  return (
    <Wrapper className="d-flex full-height">
      <SideNav />
      <div className="d-flex flex-column">
        <H2 className="mt-4 ml-4"> Create Event</H2>
        <div className="d-flex mt-2 flex-justify-center">
          {Object.keys(EventCreationSteps).map((stepKey, idx, arr) => {
            const step = EventCreationSteps[stepKey];
            return (
              <Fragment>
                <div className="d-flex flex-column justify-content-center flex-items-center">
                  <Stepper activeStep={activeStep} step={step}>
                    {step}
                  </Stepper>
                  <p className="f4 work-sans-black">
                    <FormattedMessage {...messages[stepKey]} />
                  </p>
                </div>
                {idx !== arr.length - 1 && <StepConnector />}
              </Fragment>
            );
          })}
        </div>
        <div className="d-flex full-width flex-justify-center">
          <EventBasicsForm stepForward={stepForward} />
        </div>
      </div>
    </Wrapper>
  );
}

export default CreateEventPage;
