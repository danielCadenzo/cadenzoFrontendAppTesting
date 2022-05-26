import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { fetchLoggedInUserAction } from 'data/sagas/dashboard_saga';
import { graphql, useMutation, useLazyLoadQuery } from 'react-relay';
import { withRouter } from 'react-router-dom';
import * as AuthSelectors from 'data/selectors/authSelectors';
import FormContainer from './FormContainer';
import BookingInvitationModal from './BookingInvitationModal';

const OverflowContainer = styled.div`
  height: calc(100% - 63px) !important;
  overflow: hidden;
`;

const SCHEDULE_MUTATION = graphql`
  mutation AvailabilityContainerMutation(
    $profileId: ID!
    $scheduleOverrides: [TimeRange]
    $weeklyAvailability: [AvailabilityNode]
  ) {
    modifyUserSchedule(
      profileId: $profileId
      scheduleOverrides: $scheduleOverrides
      weeklyAvailability: $weeklyAvailability
    ) {
      success
    }
  }
`;

const FETCH_SCHEDULE = graphql`
  query AvailabilityContainerQuery($id: ID) {
    profile(id: $id) {
      ... on ArtistNode {
        hometown {
          latitude
          longitude
          raw
          route
          formatted
          streetNumber
          locality {
            postalCode
            state {
              name
              code
              country {
                code
                name
                id
              }
              id
            }
            name
            id
          }
          id
        }
        calendar {
          scheduleOverrides {
            startTime
            endTime
            day
            guarantee
            doorSplit
            isNegotiable
            location {
              latitude
              longitude
              raw
              route
              formatted
              streetNumber
              locality {
                postalCode
                state {
                  name
                  code
                  country {
                    code
                    name
                    id
                  }
                  id
                }
                name
                id
              }
              id
            }
          }
          weeklyAvailability {
            dayOfWeek
            guarantee
            endTime
            startTime
            doorSplit
            isNegotiable
            guarantee
            location {
              latitude
              longitude
              raw
              route
              formatted
              streetNumber
              locality {
                postalCode
                state {
                  name
                  code
                  country {
                    code
                    name
                    id
                  }
                  id
                }
                name
                id
              }
              id
            }
          }
        }
      }

      ... on VenueNode {
        address {
          latitude
          longitude
          raw
          route
          formatted
          streetNumber
          locality {
            postalCode
            state {
              name
              code
              country {
                code
                name
                id
              }
              id
            }
            name
            id
          }
          id
        }
        calendar {
          scheduleOverrides {
            startTime
            endTime
            day
            doorSplit
            isNegotiable
            guarantee
            location {
              latitude
              longitude
              raw
              route
              formatted
              streetNumber
              locality {
                postalCode
                state {
                  name
                  code
                  country {
                    code
                    name
                    id
                  }
                  id
                }
                name
                id
              }
              id
            }
          }
          weeklyAvailability {
            dayOfWeek
            endTime
            startTime
            doorSplit
            isNegotiable
            guarantee
            location {
              latitude
              longitude
              raw
              route
              formatted
              streetNumber
              locality {
                postalCode
                state {
                  name
                  code
                  country {
                    code
                    name
                    id
                  }
                  id
                }
                name
                id
              }
              id
            }
          }
        }
      }
    }
  }
`;

function AvailabilityHome({ match }) {
  const {
    params: { profileId },
  } = match;

  const data = useLazyLoadQuery(FETCH_SCHEDULE, {
    id: profileId,
  });
  const [commit, isInFlight] = useMutation(SCHEDULE_MUTATION);
  const [isInvitationModalOpen, setInvitationModalOpen] = useState(false);

  // for keeping track of modal dates
  const [modalDaySelection, setModalCalendarDates] = useState([]);

  return (
    <OverflowContainer className="d-flex p-5 full-width flex-column">
      <BookingInvitationModal
        isOpen={isInvitationModalOpen}
        onClose={setInvitationModalOpen}
      />

      {false && <div>
        <button
          type="button"
          className="color-primary"
          onClick={() => setInvitationModalOpen(true)}
        >
          View Invitations
        </button>
      </div>}

      <FormContainer
        modalDaySelection={modalDaySelection}
        profileDefaults={data && data.profile && data.profile.calendar}
        existingOverrides={
          data && data.profile && data.profile.scheduleOverrides
        }
        setModalCalendarDates={setModalCalendarDates}
        onSubmitSchedule={commit}
        profileIsArtist={!!(data && data.profile && data.profile.hometown)}
        profileDefaultLocation={
          data &&
          data.profile &&
          (data.profile.address || data.profile.hometown)
        }
      />
    </OverflowContainer>
  );
}

const mapStateToProps = createStructuredSelector({
  is2faEnabled: AuthSelectors.getIs2faEnabled,
  email: AuthSelectors.getEmail,
  phoneNumber: AuthSelectors.getPhoneNumber,
  name: AuthSelectors.getName,
  getActiveArtistProfileId: AuthSelectors.getActiveArtistProfileId,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: () => dispatch(fetchLoggedInUserAction),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withRouter(AvailabilityHome));
