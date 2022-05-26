import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { fetchViewerEventsAction } from 'data/sagas/dashboard_saga';
import Button from 'components/Button';
import EventModal from 'containers/EventManagementPage/CEEventModal';
import { CREATE_EVENT } from 'queries/mutations/Events';
import { createGQLQuery } from 'data/api';
import { DateTime } from 'luxon';
import { redirectToUrl } from 'utils/helpers';
import Routes from 'data/Routes';
import searchIcon from '../../images/icons/search.svg';
import EventListItem from './EventListItem';

const Input = styled.input`
  background: #fafbfc;
  border-radius: 4px;
  border: none;
`;

const InputWrapper = styled.div`
  background: #fafbfc;
  border: 0.5px solid #586069;
  box-sizing: border-box;
  border-radius: 4px;
  max-width: 200px;
`;

const LineBreak = styled.hr`
  border: 1px solid #e1e4e8;
`;

const Wrapper = styled.div`
  width: 300px;
`;

function EventList(props) {
  const [email, setEmail] = useState('');
  const { dispatch, events } = props;

  if (props.email !== email) {
    dispatch(fetchViewerEventsAction());
    setEmail(props.email);
  }
  const [search, setSearchVal] = useState('');

  const onChange = e => {
    const searchVal = e.target.value;
    setSearchVal(searchVal);
  };

  const renderEvents = () => {
    const { onClick } = props;
    const filteredEvents = events.filter(node =>
      node.node.title.includes(search),
    );
    const sortedEvents = filteredEvents.sort((a, b) => {
      const dateA = DateTime.fromISO(a.node.startDate);
      const dateB = DateTime.fromISO(b.node.startDate);
      if (dateA.diff(dateB) < 0) {
        return 1;
      }
      if (dateA.equals(dateB)) {
        return 0;
      }
      return -1;
    });
    return sortedEvents.map(eventNode => (
      <EventListItem
        eventName={eventNode.node.title}
        onClick={onClick}
        startDate={eventNode.node.startDate}
        id={eventNode.node.id}
      />
    ));
  };

  const onCreateEventClick = () => {
    redirectToUrl(Routes.createEvent());
  };

  return (
    <Wrapper className="full-height flex-column d-flex shadow mr-3 py-2">
      <div className="px-2 d-flex flex-wrap flex-items-center flex-justify-center">
        <InputWrapper className="p-2 d-flex">
          <img className="mr-1" alt="Search Icon" width={16} src={searchIcon} />
          <Input placeholder="Search" onChange={onChange} />
        </InputWrapper>
        <Button onClick={onCreateEventClick} className="flex-shrink-0">
          Create
        </Button>
        <LineBreak />
      </div>
      {renderEvents()}
    </Wrapper>
  );
}

EventList.propTypes = {
  email: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
};

const mapStateToProps = state => ({
  email: state.authReducer.email,
  events: state.dashboard.events,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EventList);
