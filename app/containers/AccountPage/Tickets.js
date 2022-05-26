/* eslint-disable no-return-assign */
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Routes from 'data/Routes';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { createGQLQuery } from 'data/api';
import Modal from 'components/Modal';
import { cadenzoPrimary } from 'utils/CssVariables';
import emptyState from 'images/empty_states/no_tickets.png';
import * as RequestStates from 'redux/RequestStates';
import { TICKET_TIME_PERIOD } from './constants';
import TicketListingItem from './TicketListingItem';
import TicketTransferRequest from './TicketTransferRequest';
import TicketResellListingItem from './TicketResellListingItem';

const ColoredLink = styled(Link)`
  color: #1d82a5;
  align-self: center;
`;

const RadioButton = styled.button`
  border: 3px solid ${cadenzoPrimary};
  padding: 16px 32px;
  font-size: 18px;
  background-color: ${({ isSelected }) =>
    isSelected ? cadenzoPrimary : 'white'};
  color: ${({ isSelected }) => (isSelected ? 'white' : cadenzoPrimary)};
  ${({ isRight }) =>
    isRight ? `border-radius: 0 20px 20px 0;` : `border-radius: 20px 0 0 20px`}
`;

const TICKET_QUERY = `{
  viewer {
    email
    ticketTransfers {
      ticket {
        id
        productType{
          description
          name
          event {
            coverImage
            title
            id
            address
            startDate
          }
        }
      }
      id
      acceptanceStatus
    }
    tickets {
      edges {
        node {
          uuid
          id
          isOnMarketplace
          marketplacePrice
          transfers {
            id
            acceptanceStatus
          }
          productType{
            description
            name
            event {
              coverImage
              title
              id
              address
              startDate
            }
          }
        }
      }
    }
  }
}`;

const SHOW_MORE_TICKET_COUNT = 5;

class TicketsView extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowMoreVisible: false,
      tickets: [],
      showMore: false,
      showModal: false,
      selectedTicket: null,
      viewingPeriod: TICKET_TIME_PERIOD.UPCOMING,
      userEmail: null,
      ticketTransfers: [],
    };
    this.ref = React.createRef();
  }

  onHasBeenTransferred = ticketId => {
    const { tickets } = this.state;
    this.setState({
      tickets: tickets.filter(edge => edge.node.id !== ticketId),
    });
  };

  fetchTicketInfo = () => {
    createGQLQuery(TICKET_QUERY).then(data => {
      const { viewer } = data;
      if (viewer && viewer.tickets) {
        const { tickets, email, ticketTransfers } = viewer;
        const shouldShowMore = tickets.edges.length > SHOW_MORE_TICKET_COUNT;
        this.setState({
          tickets: tickets.edges,
          userEmail: email,
          ticketTransfers,
          showMore: shouldShowMore,
          isShowMoreVisible: shouldShowMore,
          requestStatus: RequestStates.SUCCEEDED,
        });
      }
    });
  };

  componentDidMount() {
    this.fetchTicketInfo();
  }

  renderTicketEmptyState = () => {
    const { tickets, requestStatus, ticketTransfers } = this.state;
    if (
      tickets.length !== 0 ||
      requestStatus !== RequestStates.SUCCEEDED ||
      ticketTransfers.length
    )
      return null;
    return (
      <div>
        <img style={{ maxWidth: 500 }} alt="no tickets" src={emptyState} />
      </div>
    );
  };

  renderNav = () => (
    <ol className="d-flex my-3">
      <li>
        <Link to={Routes.account()}>Account</Link>
      </li>
      <li className="mx-2"> > </li>
      <li>
        <Link>Tickets</Link>
      </li>
    </ol>
  );

  toggleModal = () => {
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal,
    });
  };

  handleClickTicket = ticket => {
    this.setState({
      showModal: true,
      selectedTicket: ticket,
    });
  };

  handleChangeViewPeriod = evt => {
    this.setState({ viewingPeriod: evt.target.value });
  };

  showAllTickets = () => {
    this.setState({
      showMore: true,
      isShowMoreVisible: false,
    });
  };

  renderTicketsOwned = () => {
    const { tickets, showMore } = this.state;
    return tickets.map((item, index) => {
      const {
        productType,
        uuid,
        id: ticketId,
        transfers,
        marketplacePrice,
        hasBeenUsed,
        isOnMarketplace,
      } = item.node;
      const { event, name: ticketName } = productType;
      const { coverImage, title, address, startDate, id } = event;

      if (index > SHOW_MORE_TICKET_COUNT && !showMore) return null;

      if (isOnMarketplace) {
        return (
          <TicketResellListingItem
            uuid={uuid}
            ticketId={ticketId}
            transfers={transfers}
            ticketName={ticketName}
            hasBeenUsed={hasBeenUsed}
            coverImage={coverImage}
            marketplacePrice={marketplacePrice}
            title={title}
            address={address}
            startDate={startDate}
            id={id}
          />
        );
      }
      return (
        <TicketListingItem
          uuid={uuid}
          ticketId={ticketId}
          eventId={id}
          transfers={transfers}
          hasBeenUsed={hasBeenUsed}
          ticketName={ticketName}
          coverImage={coverImage}
          title={title}
          address={address}
          startDate={startDate}
          id={id}
        />
      );
    });
  };

  renderPendingTicketTransfers = () => {
    const { ticketTransfers, showMore, userEmail } = this.state;
    return ticketTransfers.map((item, index) => {
      const { ticket } = item;
      const { productType, id: ticketId } = ticket;
      const { event, name: ticketName } = productType;
      const { coverImage, title, address, startDate, id } = event;
      if (index > 5 && !showMore) return null;
      return (
        <TicketTransferRequest
          ticketId={ticketId}
          transfers={{ acceptanceStatus: 'IN_PROGRESS' }}
          ticketName={ticketName}
          userEmail={userEmail}
          coverImage={coverImage}
          title={title}
          address={address}
          startDate={startDate}
          id={id}
        />
      );
    });
  };

  renderModal = () => {
    const { selectedTicket } = this.state;
    if (!selectedTicket) return null;
    const { event, group } = selectedTicket;
    const { coverImage, title } = event;
    const { title: ticketTitle, description } = group;
    return (
      <Modal isOpen onClose={this.toggleModal}>
        <div className=" border rounded p-2 d-flex m-3">
          <img alt="" src={coverImage} width={120} height={100} />
          <div className="d-flex flex-column  ml-3">
            <p className="work-sans-black">{title}</p>
            <p className="work-sans-black">{ticketTitle}</p>
          </div>
        </div>
        <p className="work-sans-black pl-3"> Description </p>
        <p className="p-3 work-sans-black">{description}</p>
      </Modal>
    );
  };

  renderTimePeriodToggle = () => {
    const { viewingPeriod } = this.state;
    const isUpcomingSelected = TICKET_TIME_PERIOD.UPCOMING === viewingPeriod;
    return (
      <div className="d-flex  flex-justify-center">
        <RadioButton
          onClick={this.handleChangeViewPeriod}
          value={TICKET_TIME_PERIOD.UPCOMING}
          type="button"
          isRight={false}
          isSelected={isUpcomingSelected}
        >
          Upcoming
        </RadioButton>
        <RadioButton
          onClick={this.handleChangeViewPeriod}
          value={TICKET_TIME_PERIOD.PAST}
          type="button"
          isSelected={!isUpcomingSelected}
          isRight
        >
          Past
        </RadioButton>
      </div>
    );
  };

  render() {
    const { isShowMoreVisible, showModal } = this.state;
    return (
      <div className="container-sm full-height mt-4 d-flex flex-column p-4">
        {this.renderNav()}
        <h2 className="h2">Your Tickets</h2>

        <div className="full-height d-flex flex-column my-3 flec-justify-center">
          {this.renderTicketEmptyState()}
          {this.renderPendingTicketTransfers()}
          {this.renderTicketsOwned()}
          {isShowMoreVisible && (
            <ColoredLink onClick={this.showAllTickets}>Show More</ColoredLink>
          )}
          {showModal && this.renderModal()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TicketsView);
