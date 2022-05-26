import React from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import Checkbox from '@material-ui/core/Checkbox';

function EventSettings() {
  const EventSettingsBox = styled.div`
    padding-left: 50px;
    padding-right: 50px;
  `;

  const SectionTitle = styled.h2`
    font-size: 38px;
  `;

  const CheckBoxLabels = styled.h4``;

  return (
    <EventSettingsBox>
      <SectionTitle>Event Settings</SectionTitle>
      <CheckBoxLabels>
        <b>Enable Secondary Marketplace:</b> <Checkbox color="primary" />
      </CheckBoxLabels>
      <CheckBoxLabels>
        Set Date and Time?
        <Checkbox color="primary" />
      </CheckBoxLabels>
      <CheckBoxLabels>Markup Limit:&nbsp;</CheckBoxLabels>
      <CheckBoxLabels>
        Enable Donations: <Checkbox color="primary" />
      </CheckBoxLabels>
      <Button variant="contained" color="primary">
        Manage Push Notifications
      </Button>
    </EventSettingsBox>
  );
}

export default EventSettings;
