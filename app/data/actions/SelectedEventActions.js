import * as selectedEventClient from 'data/clients/selectedEventClient';
import {
  SELECTED_EVENT_RECEIVED,
  SELECTED_EVENT_REQUESTED,
  SET_SELECTED_TICKET_GROUP,
  UPDATE_TICKET_GROUP_HOLDER,
  ADD_TICKET_GROUP_HOLDER,
  UPDATE_PUBLISH_STATE,
} from 'redux/ActionTypes';

export const fetchSelectedEvent = eventGid => dispatch => {
  dispatch({
    type: SELECTED_EVENT_REQUESTED,
  });
  selectedEventClient.getSelectedEvent(eventGid).then(data => {
    dispatch({
      type: SELECTED_EVENT_RECEIVED,
      payload: data,
    });
  });
};

export const setSelectedTicketGroup = ticketGroup => dispatch => {
  dispatch({
    type: SET_SELECTED_TICKET_GROUP,
    payload: ticketGroup,
  });
};

export const updateTicketHolder = ticketHolder => dispatch => {
  dispatch({
    type: UPDATE_TICKET_GROUP_HOLDER,
    payload: ticketHolder,
  });
};

export const addTicketHolder = ticketHolder => dispatch => {
  dispatch({
    type: ADD_TICKET_GROUP_HOLDER,
    payload: ticketHolder,
  });
};

export const setPublishStatusForEvent = (id, publishState) => dispatch => {
  selectedEventClient.setPublishStatusForEvent(id, publishState).then(data => {
    const {
      setPublishStatusForEvent: { success },
    } = data;
    if (success) {
      dispatch({
        type: UPDATE_PUBLISH_STATE,
        payload: {
          publishState,
        },
      });
    }
  });
};
