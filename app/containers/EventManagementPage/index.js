/**
 * Events Page
 *
 * This is the page we show for the Venue's Events
 *
 */

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EventList from 'components/EventList/EventList';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Routes, { getEventIdFromPath, getWindowOrigin } from 'data/Routes';
import backButtonIcon from 'images/icons/back_button.png';
import ShareButton from 'containers/EventPage/ShareButton';
import * as SelectedEventActions from 'data/actions/SelectedEventActions';
import * as EventActions from 'data/actions/EventActions';
import {
  getIsEventSelected,
  getSelectedEventName,
  getEvent,
  getSelectedTicketGroup,
  getTicketGroupReservedTickets,
  getTotalReservedTicketsForGroup,
} from 'data/selectors/selectedEventSelector';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import * as selectedEventClient from 'data/clients/selectedEventClient';
import { requestBaseURL } from 'data/constants';
import { Redirect } from 'react-router-dom';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import CETicketModal from './CETicketModal';
import CEEventModal from './CEEventModal';
import SideNav from '../../components/SideNav';
import TicketTable from './TicketTable';
import DeleteEventModal from './DeleteEventModal';
import PublishEventModal from './PublishModal';

const TrashIcon = (
  <path d="M5.15536 21.3333C5.15536 22.8 6.19519 24 7.46609 24H16.709C17.9799 24 19.0197 22.8 19.0197 21.3333V5.33333H5.15536V21.3333ZM7.46609 8H16.709V21.3333H7.46609V8ZM16.1313 1.33333L14.976 0H9.19914L8.04377 1.33333H4V4H20.1751V1.33333H16.1313Z" />
);

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;
class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventModalOpen: false,
      ticketModalOpen: false,
      productModalOpen: false,
      shouldRedirect: false,
      showDeleteEventModal: false,
      handlePublishData: null,
      showPublishDialog: false,
    };
  }

  componentDidMount() {
    this.fetchSelectedEvent();
  }

  handleEventModalToggle = (isOpen = false) =>
    this.setState({ eventModalOpen: !this.state.eventModalOpen });

  handleTicketModalToggle = (isOpen = false, selectedTicket) => {
    const { setSelectedTicketGroup } = this.props;
    if (selectedTicket) {
      const { node } = selectedTicket;
      setSelectedTicketGroup(node);
      this.setState({ ticketModalOpen: isOpen });
    } else {
      setSelectedTicketGroup(null);
      this.setState({ ticketModalOpen: isOpen });
    }
  };

  handleProductModalToggle = (isOpen = false) =>
    this.setState({ productModalOpen: isOpen });

  handleDeleteEventToggle = () => {
    const { showDeleteEventModal } = this.state;
    this.setState({ showDeleteEventModal: !showDeleteEventModal });
  };

  handleDeleteEvent = () => {
    const { deleteEvent } = this.props;
  };

  handleConfirmDeleteEvent = () => {
    const { event, deleteEvent } = this.props;
    const { id } = event;
    deleteEvent(id);
    this.redirectToDashboard();
  };

  handleChangePublishState = evt => {
    const { event, setPublishStatusForEvent } = this.props;
    const { id } = event;
    const { handlePublishData } = this.state;
    setPublishStatusForEvent(id, handlePublishData);
    this.togglePublishModal();
  };

  onPublishStateChange = evt => {
    const {
      target: { checked },
    } = evt;
    this.setState({
      handlePublishData: checked,
    });
    this.togglePublishModal();
  };

  togglePublishModal = () => {
    const { showPublishDialog } = this.state;
    this.setState({
      showPublishDialog: !showPublishDialog,
    });
  };

  fetchSelectedEvent = () => {
    const id = getEventIdFromPath();
    const { getSelectedEventData } = this.props;
    getSelectedEventData(id);
  };

  getEventQRCode = () => {
    const { event } = this.props;
    const { id } = event;
    return `${requestBaseURL}/event/${id}`;
  };

  onEditEvent = eventForm => {
    selectedEventClient.editEvent(eventForm).then(data => {
      if (data.editEvent && data.editEvent.success) {
        this.fetchSelectedEvent();
        this.handleEventModalToggle();
      }
    });
  };

  onCreateEvent = form => {
    selectedEventClient.createEvent(form).then(data => {
      if (data.editEvent && data.editEvent.success) {
        this.fetchSelectedEvent();
        this.handleEventModalToggle();
      }
    });
  };

  onEditTicket = form => {
    selectedEventClient.updateTicketGroup(form).then(data => {
      if (data.editEvent && data.editEvent.success) {
        this.fetchSelectedEvent();
        this.handleEventModalToggle();
      }
    });
  };

  onCreateTicket = ticketGroupForm => {
    const { event } = this.props;
    const variables = {
      ...ticketGroupForm,
      eventId: event.id,
      amount: ticketGroupForm.ticketAmt,
      maxMarkupPrice: ticketGroupForm.basePrice * 10,
    };

    selectedEventClient.createTicketGroup(variables).then(data => {
      if (data.createTicketForEvent.success) {
        this.fetchSelectedEvent();
        this.handleTicketModalToggle();
      }
    });
  };

  onDeleteTicket = id => {
    selectedEventClient.deleteTicketGroup(id).then(data => {
      if (data.deleteTicketsForEvent.success) {
        this.fetchSelectedEvent();
        this.handleTicketModalToggle();
      }
    });
  };

  get ticketGroupNames() {
    const { eventData, isEventSelected } = this.props;
    if (eventData && isEventSelected) {
      return eventData.event.productGroups.edges.map(node => node.node.name);
    }
    return [];
  }

  redirectToDashboard = () => this.setState({ shouldRedirect: true });

  render() {
    const {
      addTicketHolder,
      isEventSelected,
      event,
      selectedEventName,
      reservedTicketHolders,
      selectedTicketGroup,
      updateTicketHolder,
    } = this.props;
    if (!isEventSelected) return null;
    const {
      eventModalOpen,
      productModalOpen,
      shouldRedirect,
      showDeleteEventModal,
    } = this.state;
    const selectedEvent = event;
    const {
      ticketPrimaryRevenue,
      grossRevenue,
      revenuePerCap,
      id,
      isPublic,
    } = selectedEvent;
    return (
      <Row className="d-flex full-height">
        <SideNav />
        <EventList />
        <div className="d-flex flex-column p-3 full-width">
          <div className="d-flex flex-items-center">
            <IconButton className="mr-2" onClick={this.redirectToDashboard}>
              <img
                alt="go back to dashboard"
                src={backButtonIcon}
                width={24}
                height={24}
              />
            </IconButton>
            {shouldRedirect && <Redirect to={Routes.homeDashboard()} />}
            <Header>{selectedEventName}</Header>
            <Button
              className="ml-2"
              onClick={() => {
                this.handleEventModalToggle(true);
              }}
            >
              Edit Event
            </Button>
            <IconButton className="">
              <ShareButton
                link={`${getWindowOrigin()}${Routes.eventPage(id)}`}
              />
            </IconButton>
            <IconButton onClick={this.handleDeleteEventToggle} className="">
              <SvgIcon color="error">{TrashIcon}</SvgIcon>
            </IconButton>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={this.onPublishStateChange}
                />
              }
              label="Published"
            />

            <PublishEventModal
              isOpen={this.state.showPublishDialog}
              onClose={this.togglePublishModal}
              onConfirm={this.handleChangePublishState}
            />

            {eventModalOpen && (
              <CEEventModal
                onUpdateEvent={this.onEditEvent}
                {...selectedEvent}
                eventSpec={selectedEvent}
                isOpen={eventModalOpen}
                event={selectedEvent}
                onClose={this.handleEventModalToggle}
                refetchEvent={this.fetchSelectedEvent}
              />
            )}
          </div>
          <Column>
            <Row className="flex-wrap flex-justify-around">
              <Column>
                <div>
                  <div className="d-flex flex-items-center">
                    <h1>Ticket Management</h1>
                    <Button onClick={() => this.handleTicketModalToggle(true)}>
                      Add Ticket
                    </Button>
                    {this.state.ticketModalOpen && (
                      <Modal
                        header="Edit Ticket"
                        isOpen={this.state.ticketModalOpen}
                        onClose={this.handleTicketModalToggle}
                        modalWidth="70%"
                      >
                        <CETicketModal
                          onEditTicket={this.onEditTicket}
                          onCreateTicket={this.onCreateTicket}
                          onClose={this.handleTicketModalToggle}
                          ticketGroup={selectedTicketGroup || undefined}
                          ticketHolders={reservedTicketHolders}
                          onUpdateTicketHolder={updateTicketHolder}
                          onAddTicketHolder={addTicketHolder}
                        />
                      </Modal>
                    )}
                  </div>
                  <TicketTable
                    selectedEvent={selectedEvent}
                    onEditTicketGroup={this.handleTicketModalToggle}
                    onDeleteTicketGroup={this.onDeleteTicket}
                  />
                </div>
              </Column>
            </Row>
          </Column>
          {showDeleteEventModal && (
            <DeleteEventModal
              isOpen={showDeleteEventModal}
              onClose={this.handleDeleteEventToggle}
              onConfirm={this.handleConfirmDeleteEvent}
            />
          )}

          <div className="d-flex flex-justify-around" />
          <div className="d-flex flex-justify-around full-width mt-3" />
        </div>
      </Row>
    );
  }
}

EventsPage.propTypes = {
  addTicketHolder: PropTypes.func.isRequired,
  isEventSelected: PropTypes.bool,
  event: PropTypes.object,
  getSelectedEventData: PropTypes.func.isRequired,
  reservedTicketHolders: PropTypes.array,
  selectedEventName: PropTypes.string,
  setSelectedTicketGroup: PropTypes.func.isRequired,
  selectedTicketGroup: PropTypes.object,
  setPublishStatusForEvent: PropTypes.func.isRequired,
  updateTicketHolder: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  event: getEvent(),
  isEventSelected: getIsEventSelected(),
  selectedEventName: getSelectedEventName(),
  selectedTicketGroup: getSelectedTicketGroup(),
  reservedTicketHolders: getTicketGroupReservedTickets(),
  ticketGroupReservedTotal: getTotalReservedTicketsForGroup(),
});

const mapDispatchToProps = {
  addTicketHolder: SelectedEventActions.addTicketHolder,
  getSelectedEventData: SelectedEventActions.fetchSelectedEvent,
  setSelectedTicketGroup: SelectedEventActions.setSelectedTicketGroup,
  updateTicketHolder: SelectedEventActions.updateTicketHolder,
  setPublishStatusForEvent: SelectedEventActions.setPublishStatusForEvent,
  deleteEvent: EventActions.deleteEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventsPage);
