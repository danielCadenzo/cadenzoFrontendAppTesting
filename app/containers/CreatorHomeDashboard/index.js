// use es6

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Routes from 'data/Routes';
import { createGQLQuery } from 'data/api';
import * as AuthSelectors from 'data/selectors/authSelectors';
import * as DashboardSelectors from 'data/selectors/dashboardSelectors';
import { connect } from 'react-redux';
import Button from 'components/Button';
import calendarIcon from 'images/icons/calendar.png';
import { DateTime } from 'luxon';
import BookingCalendar from 'components/Calendar/BookingCalendar';
import { Helmet } from 'react-helmet';
import { setActiveProfile } from 'data/actions/AuthActions';
import UIBanner from 'components/UiBanner';
import UIMain from 'components/UiMain';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import PopupModal from 'components/PopupModal';

import personSrc from 'images/person.png';
import calendarSrc from 'images/calendar.png';

import { updateBookings } from 'data/actions/DashboardActions';
import DeleteProfileModal from './DeleteProfileModal';
import AdminManagePanel from './AdminManagePanel';
import BookingModal from './BookingModal';
import messages from './messages';
import EmptyState from './EmptyState';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';
import { cadenzoPrimary } from '../../utils/CssVariables';

import DocumentModal from './DocumentModal';
import { ShareProfileModal } from './ShareProfileModal';
import DashboardTable from './DashboardTable';

const OBJECT_TYPE = `{objectType}`;

const Image = styled.img`
  display: block;
  max-width: 500px;
  max-height: 269px;
  width: auto;
  height: auto;
`;

const DELETE_PROFILE_MUTATIONN = `
  mutation($id: ID!){
    delete{objectType}Profile(id: $id){
      success
    }
  }
`;

const GET_UPCOMING_BOOKINGS = `
query VenueArtistShowQuery($id: ID!,  $startDate: DateTime) {
  profile(id: $id) {
    __typename
    ... on ArtistNode {
      id
      avatar
      name
      images
      admins {
        id
        email
        avatar
      }
      calendar {
        id
      }
      documents {
        name
        url
        description
      }
      bookingRequests(startDate_Gte: $startDate){
        edges {
          node {
            __typename
            id
            startDate
            guarantee
            stipulations
            status
            endDate
            initiator
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            lastUpdatedBy {
              id
            }
            venue {
              name
              id
              avatar
              rId
              facebookProfile
              instagramProfile
              preferredPerformances
            }
            performer {
              name
              id
              rId
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
            }
          }
        }
      }
      cancelledBookings {
        edges {
          node {
            id
            startDate
            stipulations
            guarantee
            endDate
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            isCancelled
            performer {
              name
              avatar
              genres
              id
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
              documents {
                url
                name
              }
            }
            venue {
              name
              id
              avatar
              facebookProfile
              instagramProfile
              preferredPerformances
            }
          }
        }
      }
      confirmedBookings {
        edges {
          node {
            id
            startDate
            stipulations
            guarantee
            endDate
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            isCancelled
            performer {
              name
              avatar
              genres
              id
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
            }
            venue {
              name
              id
              avatar
              facebookProfile
              instagramProfile
              preferredPerformances
            }
          }
        }
      }
    }
    
    ... on VenueNode {
      id
      avatar
      name
      images
      admins {
        id
        email
        avatar
      }
      calendar {
        id
      }
      bookingRequests(startDate_Gte: $startDate){
        edges {
          node {
            id
            startDate
            guarantee
            stipulations
            status
            endDate
            initiator
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            lastUpdatedBy {
              id
            }
            venue {
              name
              id
              avatar
              rId
              facebookProfile
              instagramProfile
              preferredPerformances
            }
            performer {
              name
              id
              rId
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
            }
          }
        }
      }
      confirmedBookings {
        edges {
          node {
            id
            startDate
            stipulations
            guarantee
            endDate
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            isCancelled
            performer {
              name
              avatar
              genres
              id
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
              documents {
                url
                name
              }
            }
            venue {
              name
              id
              avatar
              facebookProfile
              instagramProfile
              preferredPerformances
            }
          }
        }
      }
      
      cancelledBookings {
        edges {
          node {
            id
            startDate
            stipulations
            guarantee
            endDate
            lineupSlot
            revenueSplit
            revenueSplitAmount
            performanceLength
            isCancelled
            performer {
              name
              avatar
              genres
              id
              avatar
              spotifyProfile
              instagramProfile
              soundcloudProfile
              twitterProfile
              youtubeProfile
              applemusicProfile
              bandcampProfile
              genres
              documents {
                url
                name
              }
            }
            venue {
              name
              id
              avatar
              facebookProfile
              instagramProfile
              preferredPerformances
            }
          }
        }
      }
    }
  }
}

`;

const UpdateProfileAdmins = `
  mutation CreatorHomeDashboardProfileAdminMutation(
    $emails: [String]!
    $profileId: ID!
  ) {
    sendAdminInvitations(toEmails: $emails, profileId: $profileId) {
      success
    }
  }
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  overflow: scroll;
  align-items: center:
  
`;

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  width: 100%;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;

  @media ${deviceMax.mobileL} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  hr {
    background-color: ${cadenzoPrimary};
    border: none;
    height: 1px;
  }
`;

const MainContentContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 15px;
  position: relative;

  @media ${deviceMax.tablet} {
    width: 100vw;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  left: 0px;
  width: 100%;
  margin-bottom: 40px;

  @media ${deviceMax.mobileL} {
    align-items: center;
    margin-bottom: unset;
  }

  h1 {
    font-family: Work Sans;
    font-style: bold;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${cadenzoPrimary};
    margin-bottom: 3px;
    font-size: xx-large;
  }

  h3 {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 400;
    letter-spacing: -0.02em;
    color: ${cadenzoPrimary};
    margin-top: 0px;
  }
`;
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null,
      showProfileDeletionModal: false,
      showAdminModal: false,
      showBookingModal: false,
      showShareModal: false,
      bookingModalReadOnly: false,
      bookingModalId: null,
      allBookingsById: {},
      width: 0,
      isCancelled: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    const { activeProfile } = this.props;
    if (activeProfile) this.fetchProfileData();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps) {
    const { activeProfile } = this.props;

    if (!activeProfile && prevProps.activeProfile) return;

    if (
      (activeProfile && !prevProps.activeProfile) ||
      (activeProfile && activeProfile.id !== prevProps.activeProfile.id)
    ) {
      this.fetchProfileData();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ profileData: null });
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  get isArtistProfile() {
    const { activeProfile } = this.props;
    const { profileType } = activeProfile;
    return profileType === 'ARTIST';
  }

  get editProfileLink() {
    const {
      activeProfile: { id },
    } = this.props;
    if (this.isArtistProfile) {
      return Routes.editArtistProfile(id);
    }
    return Routes.editVenueProfile(id);
  }

  get viewProfileLink() {
    const {
      activeProfile: { id },
    } = this.props;
    if (this.isArtistProfile) {
      return Routes.artistBookingPage(id);
    }
    return Routes.venueBookingPage(id);
  }

  get profileIsLoaded() {
    return !!this.state.profileData;
  }

  get calendarDates() {
    const { profileData } = this.state;
    const { confirmedBookings } = profileData;
    const { edges: bookingNodes } = confirmedBookings;
    return bookingNodes.map(node =>
      new DateTime(node.node.startDate).toLocal({ zone: 'utc' }),
    );
  }

  fetchProfileData = () => {
    const { activeProfile, setBookings } = this.props;
    let profileData = null;
    if (!activeProfile) return;
    createGQLQuery(GET_UPCOMING_BOOKINGS, {
      id: activeProfile.id,
    }).then(data => {
      profileData = data.profile;

      const allBookings = profileData.confirmedBookings.edges.concat(
        profileData.bookingRequests.edges,
      );

      const allBookingsById = allBookings.reduce((acc, currVal) => {
        acc[currVal.node.id] = currVal.node;
        return acc;
      }, {});

      setBookings(
        profileData.cancelledBookings.edges,
        profileData.confirmedBookings.edges,
        profileData.bookingRequests.edges,
      );

      this.setState({
        profileData,
        allBookingsById,
      });
    });
  };

  onDeleteProfile = () => {
    const {
      activeProfile: { id },
      setActiveProfileId,
    } = this.props;
    const queryType = this.isArtistProfile ? 'Artist' : 'Venue';
    createGQLQuery(DELETE_PROFILE_MUTATIONN.replace(OBJECT_TYPE, queryType), {
      id,
    }).then(() => {
      setActiveProfileId(null);
      this.setState({
        profileData: null,
        showProfileDeletionModal: false,
      });
    });
  };

  onUpdateAdmins = admins => {
    const {
      activeProfile: { id },
    } = this.props;
    createGQLQuery(UpdateProfileAdmins, {
      profileId: id,
      emails: admins,
    }).then(() => {
      this.setState({
        showAdminModal: false,
      });
    });
  };

  onToggleDeletionModal = () => {
    this.setState({
      showProfileDeletionModal: !this.state.showProfileDeletionModal,
    });
  };

  onToggleAdminPanel = () => {
    const { showAdminModal } = this.state;
    this.setState({
      showAdminModal: !showAdminModal,
    });
  };

  onToggleBookingModal = () => {
    const { showBookingModal } = this.state;
    this.setState({
      showBookingModal: !showBookingModal,
    });
  };

  onToggleShareModal = () => {
    const { showShareModal } = this.state;
    this.setState({
      showShareModal: !showShareModal,
    });
  };

  onDayClick = (day, bookingInfo) => {
    this.setState({
      daySelected: day.format('YYYY-MM-DD'),
    });
  };

  renderProfileBanner = () => {
    const { profileData } = this.state;

    if (profileData && profileData.calendar && profileData.calendar.id)
      return null;

    return (
      <div className="m-3 mx-5">
        <UIBanner
          title={<FormattedMessage {...messages.bannerCalendarTitle} />}
          text={
            <p>
              <FormattedHTMLMessage {...messages.bannerCalendarText} />
              <a
                className="text-underline"
                href={Routes.calendar(profileData.id)}
              >
                here
              </a>
            </p>
          }
        />
      </div>
    );
  };

  handleCalendarBookingSelect = (dateRange, booking) => {
    if (!booking.performer) return null;
    this.setState({
      bookingModalId: booking.id,
      showBookingModal: true,
      bookingModalReadOnly: false,
      isCancelled: false,
    });
  };

  handleBookingSelect = bookingId => {
    this.setState({
      bookingModalId: bookingId,
      showBookingModal: true,
      bookingModalReadOnly: false,
      isCancelled: false,
    });
  };

  renderEmptyState = () => <EmptyState />;

  renderCalendarEmptyState = () => {
    const { profileData } = this.state;
    return (
      <div className="d-flex flex-items-center">
        <Image src={calendarIcon} style={{ maxHeight: '32px' }} />
        <p className="mx-2">
          You do not have a schedule set! Set a calendar so others can know your
          availability.
        </p>

        <a className="ml-2" href={Routes.calendar(profileData.id)}>
          <Button className="p-3 no-wrap">Create Calendar</Button>
        </a>
      </div>
    );
  };

  renderCalendarInfo = () => (
    <p style={{ maxWidth: 'calc(100% - 15px)', textAlign: 'center' }}>
      You can always update your availability{' '}
      <a href={Routes.calendar()} className="color-primary">
        here
      </a>
    </p>
  );

  renderCalendarSection = () => {
    const { profileData } = this.state;
    const { activeProfile } = this.props;
    const { calendar } = profileData;

    if (!calendar) return this.renderCalendarEmptyState();

    if (!profileData) return null;

    return (
      <div className="d-flex flex-wrap flex-justify-center">
        <BookingCalendar
          id="your_unique_id"
          numberOfMonths={1}
          calendarDatesWithBookingInfo={
            profileData.calendar.bookingAvailability || []
          }
          isDayBlocked={(day, bookingInfo) => false}
          isForVenue={!this.isArtistProfile}
          onUpdate={this.onDayClick}
          showAvailabilityDetail
          onSlotSelected={this.handleCalendarBookingSelect}
          creatorId={activeProfile.id}
          isDayHighlighted={date =>
            this.calendarDates.some(
              booking =>
                // luxon date vs momentjs conversion
                booking.month === date.month() + 1 &&
                booking.day === date.date(),
            )
          }
        />
      </div>
    );
  };

  renderDashboard = () => {
    const {
      profileData,
      showProfileDeletionModal,
      showAdminModal,
      showShareModal,
    } = this.state;
    const { activeProfile, isActiveProfileVenue } = this.props;
    const {
      confirmedBookings,
      cancelledBookings,
      bookingRequests,
    } = this.props;

    return (
      <BoxContainer>
        <>
          <div
            className="d-flex flex-column flex-items-center full-width"
            style={{ backgroundColor: '#fafafa' }}
          >
            <Wrapper>
              <MainContentContainer>
                <SectionHeader>
                  <div className="d-flex flex-justify-between">
                    <h1> Dashboard </h1>
                    <div className="d-flex">
                      <button
                        className="f4 d-flex flex-items-center color-primary cursor-pointer"
                        onClick={this.onToggleAdminPanel}
                        type="button"
                      >
                        <img
                          height="18px"
                          width="17px"
                          className="mr-1"
                          src={personSrc}
                          alt="Manage admins"
                        />
                        Manage admins{' '}
                      </button>

                      <a
                        className="f4 color-primary d-flex flex-items-center mx-2 cursor-pointer"
                        href={Routes.calendar(activeProfile.id)}
                      >
                        <img
                          height="18px"
                          width="17px"
                          className="mr-1"
                          src={calendarSrc}
                          alt=""
                        />
                        Edit calendar
                      </a>
                      {this.isArtistProfile && this.profileIsLoaded && (
                        <DocumentModal profile={this.state.profileData} />
                      )}
                      <Button onClick={this.onToggleShareModal}>
                        Share Profile
                      </Button>
                    </div>
                  </div>

                  <hr />
                  {activeProfile && profileData && this.renderProfileBanner()}
                </SectionHeader>
                <div className="d-flex full-width flex-wrap">
                  <div className="col-6">
                    <DashboardTable
                      isActiveProfileVenue={isActiveProfileVenue}
                      bookingRequests={bookingRequests}
                      upcomingBookings={confirmedBookings}
                      cancelledBookings={cancelledBookings}
                      onBookingClick={this.handleBookingSelect}
                    />
                  </div>
                  <div className="col-6">{this.renderCalendarSection()}</div>
                </div>
              </MainContentContainer>
            </Wrapper>
          </div>
        </>
        {showShareModal && (
          <PopupModal
            header="Share Profile"
            isOpen={showShareModal}
            onClose={this.onToggleShareModal}
          >
            <ShareProfileModal viewProfileLink={this.viewProfileLink} />
          </PopupModal>
        )}

        {showProfileDeletionModal && (
          <DeleteProfileModal
            isOpen={showProfileDeletionModal}
            onClose={this.onToggleDeletionModal}
            onConfirm={this.onDeleteProfile}
          />
        )}
        {showAdminModal && (
          <AdminManagePanel
            isOpen={showAdminModal}
            onConfirm={this.onUpdateAdmins}
            onClose={this.onToggleAdminPanel}
            existingAdmins={profileData.admins}
          />
        )}
      </BoxContainer>
    );
  };

  renderBookingForm = () => {
    const {
      showBookingModal,
      bookingModalReadOnly,
      bookingModalId,
      isCancelled,
    } = this.state;
    const { allBookingsById } = this.props;

    if (!showBookingModal || !allBookingsById[bookingModalId]) return null;

    return (
      <BookingModal
        isOpen={showBookingModal}
        venueId={
          allBookingsById[bookingModalId] &&
          allBookingsById[bookingModalId].venue.id
        }
        readOnly={bookingModalReadOnly}
        booking={allBookingsById[bookingModalId]}
        onConfirm={this.onToggleBookingModal}
        onClose={this.onToggleBookingModal}
        isCancelled={isCancelled}
      />
    );
  };

  render() {
    const { activeProfile } = this.props;
    const { profileData } = this.state;

    return (
      <UIMain
        style={{ minHeight: '100%', maxHeight: '100%', overflow: 'hidden' }}
      >
        <Helmet>
          <title>Dashboard | Cadenzo</title>
          <meta name="description" content="View all your show bookings" />
        </Helmet>
        <div className="d-flex full-width">
          {!activeProfile && this.renderEmptyState()}
          {activeProfile && profileData && this.renderDashboard()}
        </div>
        {this.renderBookingForm()}
      </UIMain>
    );
  }
}

const mapStateToProps = state => ({
  activeProfile: AuthSelectors.getActiveProfile(state),
  allBookingsById: {
    ...DashboardSelectors.getCancelledBookingsById(state),
    ...DashboardSelectors.getConfirmedBookingsById(state),
    ...DashboardSelectors.getBookingRequestsById(state),
  },
  bookingRequests: DashboardSelectors.getBookingRequests(state),
  confirmedBookings: DashboardSelectors.getConfirmedBookings(state),
  cancelledBookings: DashboardSelectors.getCancelledBookings(state),
  isActiveProfileVenue: AuthSelectors.getIsActiveProfileAnVenue(state),
});

const mapDispatchToProps = {
  setActiveProfileId: setActiveProfile,
  setBookings: updateBookings,
};

HomePage.propTypes = {
  activeProfile: PropTypes.object.isRequired,
  allBookingsById: PropTypes.object.isRequired,
  isActiveProfileVenue: PropTypes.bool,
  setActiveProfileId: PropTypes.func.isRequired,
  cancelledBookings: PropTypes.array,
  confirmedBookings: PropTypes.array,
  bookingRequests: PropTypes.array,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
