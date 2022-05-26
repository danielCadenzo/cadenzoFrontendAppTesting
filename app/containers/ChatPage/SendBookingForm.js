'use es6';

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm, useField } from 'react-form';
import H4 from 'components/H4';
import { IconButton } from '@material-ui/core';
import { EventTypes } from 'containers/App/constants';
import { uploadImage } from 'data/clients/eventClient';
import { usePrevious } from 'utils/customHooks';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import styled from 'styled-components';
import { cadenzoPrimary } from 'utils/CssVariables';
import Button from 'components/Button';
import * as selectedEventClient from 'data/clients/selectedEventClient';
import DateTimeField from 'components/Form/DateTimeField';
import LocationField from 'components/Form/LocationField';
import Label from 'components/Form/Label';
import FormControl from 'components/Form/FormControl';
import FormErrorContainer from 'components/Form/FormErrorContainer';
import InputField from 'components/Form/InputField';

function SendBookingForm() {
  return <div />;
}

export default SendBookingForm;
