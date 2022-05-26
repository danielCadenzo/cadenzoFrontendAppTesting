/**
 *
 * PatronPage
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { createGQLQuery } from 'data/api';
import editIcon from 'images/icons/edit.svg';
import EventList from 'components/EventList/EventList';
import * as PatronPageActions from 'redux/actions/PatronPageActions';
import { checkinUser } from 'data/clients/PatronPageClient';
import trashIcon from '../../images/icons/trash.svg';
import { ATTENDEE_STATUS, ATTENDEE_SCOPE } from './constants';

import SideNav from '../../components/SideNav';
import FilterList from '../../components/FilterList';
import { fetchMembershipsAction } from './actions';

import IconButton from '../../components/IconButton';
import AttendeeTable from './AttendeeTable';
import ListSidebar from './ListSidebar';

const UserListWrapper = styled.div`
  width: 100%;
  height: 700px;
  font-size: 14px;
`;

const GET_VIEWER_MEMBERSHIPS = `
{
  viewer{
    memberships {
      id
      name
      price
      eventsRemaining
      amountSold
      autoAddEvents
      membershipType
      events {
        edges {
          node {
            id
            title
            databaseId
          }
        }
      }
    }
  }
}
`;

const UPDATE_MEMBERSHIP = `
  mutation($id: ID!, $price: Float!, $name: String!, $events: [Int]){
    editMembership(id: $id, events: $events, name: $name, price: $price) {
      success
    }
  }
`;

const CREATE_MEMBERSHIP = `
  mutation($price: Float!, $name: String!, $events: [Int]){
    createMembership(events: $events, name: $name, price: $price) {
      success
    }
  }
`;

class PatronPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      emailFilter: '',
      guestStatus: ATTENDEE_STATUS.ATTENDING,
      viewLevel: ATTENDEE_SCOPE,
    };
    // this.getMemberships();
  }

  componentDidUpdate(prevProps, prevState) {
    const { emailFilter: email, guestStatus, eventId, viewLevel } = this.state;
    if (
      prevState.guestStatus !== guestStatus ||
      prevState.emailFilter !== email ||
      prevState.eventId !== eventId ||
      prevState.viewLevel !== viewLevel
    ) {
      this.getEventUsers();
    }
  }

  handleCloseMembershipModal = () =>
    this.setState({ showMembershipModal: false, membership: null });

  getEventUsers = () => {
    const { emailFilter: email, guestStatus, eventId, viewLevel } = this.state;
    this.props.fetchUsers({
      email,
      guestStatus,
      eventId,
      viewLevel,
    });
  };

  onAttendeeSearchChange = evt => {
    this.setState({ emailFilter: evt.target.value });
  };

  onChangeGuestStatus = newStatus => {
    this.setState({ guestStatus: newStatus });
  };

  onSelectMembership = membership => {
    this.setState({ membership, showMembershipModal: true });
  };

  getMemberships = () => {
    const { dispatch } = this.props;
    createGQLQuery(GET_VIEWER_MEMBERSHIPS).then(data => {
      const { memberships } = data.viewer;
      dispatch(fetchMembershipsAction(memberships));
    });
  };

  onUpdateMembership = membership => {
    const { id } = membership;
    if (id) {
      createGQLQuery(UPDATE_MEMBERSHIP, membership).then(data => {
        if (data.editMembership && data.editMembership.success) {
          this.getMemberships();
          this.handleCloseMembershipModal();
        }
      });
    } else {
      const { price, name, eventIds } = membership;
      if (price && name && eventIds) {
        createGQLQuery(CREATE_MEMBERSHIP, membership).then(data => {
          if (data.createMembership && data.createMembership.success) {
            this.getMemberships();
            this.handleCloseMembershipModal();
          }
        });
      }
    }
  };

  userListComponent = props => (
    <div className="p-2 d-flex flex-items-center">
      <img
        alt="avatar"
        src="https://via.placeholder.com/50"
        className="circle"
        height={20}
        width={20}
      />
      <p className="ml-2">{props.item.email}</p>
    </div>
  );

  membershipComponent = props => (
    <div className="p-2 d-flex flex-items-center">
      <img
        alt="avatar"
        src="https://via.placeholder.com/50"
        className="circle"
        height={20}
        width={20}
      />
      <p className="ml-2">{props.item.name}</p>
    </div>
  );

  getMembershipTableColumns = () => {
    const { onSelectMembership } = this;
    return [
      {
        Header: 'Name',
        accessor: membership => membership.name,
        id: 'name',
        getCellProps: () => ({
          style: { width: '200px' },
        }),
      },
      {
        Header: 'Events Left',
        accessor: membership => membership.eventsRemaining,
        id: 'eventsRemaining',
      },
      {
        Header: 'Amt Sold',
        accessor: membership => membership.amountSold,
        id: 'amountSold',
      },
      {
        Header: '',
        id: 'id',
        getCellProps: () => ({
          style: {},
        }),
        accessor: row => (
          <div className="d-flex">
            <IconButton
              className="pl-2"
              icon={editIcon}
              onClick={e => onSelectMembership(row)}
              {...row}
            />
            <IconButton
              className="mx-2"
              icon={trashIcon}
              onClick={e => console.log(row)}
              {...row}
            />
          </div>
        ),
      },
    ];
  };

  getUserTableColumns = () => [
    {
      accessor: user => (
        <img
          alt="avatar"
          src="https://via.placeholder.com/50"
          className="circle"
          height={20}
          width={20}
        />
      ),
      id: 'avatar',
      getCellProps: () => ({
        style: { width: '30px' },
      }),
    },
    {
      accessor: user => user.email,
      id: 'email',
    },
  ];

  handleEventSelect = eventId => {
    this.setState({ eventId });
  };

  handleCheckIn = guestId => {
    const { eventId } = this.state;
    // TODO: Move into redux and track request success
    checkinUser({ id: eventId, userId: guestId }).then(() =>
      this.getEventUsers(),
    );
  };

  render() {
    const { users, listCounts } = this.props;
    const { guestStatus } = this.state;

    return (
      <div className="d-flex full-height full-width">
        <SideNav />
        <EventList onClick={this.handleEventSelect} />
        <ListSidebar
          listCounts={listCounts}
          onChange={this.onChangeGuestStatus}
          selectedValue={guestStatus}
        />
        <div className="d-flex flex-column full-height full-width">
          <div className="d-flex">
            <UserListWrapper className="m-2 p-2">
              <h3 className="mb-1" style={{ fontWeight: 700 }}>
                Attendee List
              </h3>
              <FilterList
                placeholder="Search Attendees"
                onChange={this.onAttendeeSearchChange}
                items={[]}
              />
              <AttendeeTable data={users} onCheckIn={this.handleCheckIn} />
            </UserListWrapper>
          </div>
        </div>
      </div>
    );
  }
}

PatronPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  memberships: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  listCounts: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  users: state.patronPage.userList,
  listCounts: state.patronPage.attendeeListCounts,
  memberships: state.patronPage.membershipList,
});

const mapDispatchToProps = {
  fetchUsers: PatronPageActions.fetchTicketRevenue,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PatronPage);
