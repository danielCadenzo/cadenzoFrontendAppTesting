/**
 *
 * EventPage
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Button from 'components/Button';
import { createGQLQuery } from 'data/api';
import heartIcon from 'images/icons/heart.svg';
import filledHeartIcon from 'images/icons/filled-heart.svg';
import { toMonthDayString, toFullDate12hr } from 'utils/dates';
import * as EventActions from 'data/actions/EventActions';
import * as UserActions from 'data/actions/AuthActions';
import { MOBILE_BREAKPOINT } from 'utils/CssVariables';
import { FETCH_EVENT_QUERY } from './queries';
import { setSelectedEvent } from './actions';
import * as EventPageSelectors from './selectors';
import Footer from '../EventLandingPage/UniversalFooter';
import TicketModal from './TicketModal';
import ShareButton from './ShareButton';

const EventContainer = styled.div`
  max-width: 980px;
  min-width: 480px;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  background-color: white;
  position: relative;
  z-index: 2;
  width: 80%;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    min-width: inherit;
  }
`;

const BlurContainer = styled.div`
  overflow: hidden;
  height: 400px;
  position: absolute;
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: inherit;
  min-height: 200px;
  min-width: 100%;
  @media (min-width: ${MOBILE_BREAKPOINT}) {
    height: 360px;
    width: 720px;
  }
`;

const ImageContainer = styled.div`
  @media (min-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    width: 100%;
  }
`;

const EventHeader = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;
class EventPage extends Component {
  constructor(props) {
    super(props);
    const path = window.location.pathname.split('/event/');
    if (!path || path.length < 2) {
      // id not present return redirect to 404
    }
    this.eventId = path[1];
    const { setSelectedEvent } = props;
    createGQLQuery(FETCH_EVENT_QUERY, { id: this.eventId }).then(data => {
      if (data.event) {
        const {
          event: { venueMap },
        } = data;

        if (venueMap && venueMap.seatingMap) {
          // eslint-disable-next-line no-param-reassign
          data.event.venueMap.seatingMap = JSON.parse(
            data.event.venueMap.seatingMap,
          );
        }

        setSelectedEvent(data.event);
      }
    });

    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    const { fetchMarketplaceTickets } = this.props;
    fetchMarketplaceTickets(this.eventId);
  }

  handleFollowClick = () => {
    const {
      event,
      doesFollowOrganizer,
      followOrganizer,
      unfollowOrganizer,
    } = this.props;
    const {
      organizer: { id },
    } = event;
    if (doesFollowOrganizer) {
      unfollowOrganizer([id]);
    } else {
      followOrganizer([id]);
    }
  };

  onFavoriteEvent = () => {
    const {
      favoriteEvent,
      unfavoriteEvent,
      event,
      setSelectedEvent,
    } = this.props;
    const { id, isFavorited } = event;
    if (!isFavorited) {
      favoriteEvent(id).then(data => {
        if (data.favoriteEvent.success) {
          event.isFavorited = true;
          setSelectedEvent(event);
        }
      });
    } else {
      unfavoriteEvent(id).then(data => {
        if (data.unfavoriteEvent.success) {
          event.isFavorited = false;
          setSelectedEvent(event);
        }
      });
    }
  };

  onOpenModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  render() {
    const {
      event,
      isEventLoaded,
      isEventFavorited,
      gaTicketOptions,
    } = this.props;
    if (!isEventLoaded) return null;

    const {
      coverImage,
      description,
      title,
      startDate,
      endDate,
      id,
      address,
      ticketGroups,
      organizer,
    } = event;

    const { username, doesFollow } = organizer;

    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);

    const Blur = styled.div`
      background-image: url('${coverImage}');
      overflow-x: hidden;
      background-position: center top;
      background-size: cover;
      filter: blur(8px);
      -webkit-filter: blur(8px);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      height: 300px;
      position: absolute;
      top: 5%;
      left: 0;
      filter: blur(50px) brightness(.9);
      display: inline-block;
      width: 200%;
      position: relative;
    `;

    const isFavoritedIcon = isEventFavorited ? filledHeartIcon : heartIcon;

    const { showModal } = this.state;
    return (
      <div
        className="d-flex flex-column full-width fit-content-height position-relative"
        style={{ backgroundColor: '#f8f7fa' }}
      >
        <Helmet>
          <title>Cadenzo - {title}</title>
          <meta name="description" content={`${title} presented by Cadenzo`} />
        </Helmet>
        <BlurContainer>
          <Blur />
        </BlurContainer>
        <div className="full-width full-height">
          <EventContainer className="flex-justify-center pb-4">
            <EventHeader className="d-flex">
              <ImageContainer>
                <Image src={coverImage} />
              </ImageContainer>
              <div className="d-flex flex-column p-3">
                <div className="f4">{toMonthDayString(eventStart)}</div>
                <div className="f2 my-2"> {title} </div>
                <div className="d-flex flex-items-center flex-wrap">
                  <p className="mr-1 work-sans-black">by {username}</p>
                  <Button
                    style={{ minWidth: 100 }}
                    inverted={doesFollow}
                    onClick={this.handleFollowClick}
                  >
                    {doesFollow ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </div>
            </EventHeader>
            <div className="d-flex flex-justify-between border-top border-bottom flex-items-center">
              <div className="mx-2">
                <img
                  className="mx-2"
                  width="30px"
                  alt="favorite event"
                  src={isFavoritedIcon}
                  onClick={this.onFavoriteEvent}
                />
                <ShareButton />
              </div>
              <Button className="px-6 mr-4 py-2" onClick={this.onOpenModal}>
                Tickets
              </Button>
            </div>
            <div className="d-flex p-3">
              <div className="d-flex flex-column full-width">
                <b className="text-bold">About This Event</b>
                <p className="color-gray mt-3">{description}</p>
              </div>
              <div className="px-3">
                <b className="text-bold work-sans-black mb-2">Date & Time</b>
                <p className="work-sans-black">
                  {toFullDate12hr(eventStart)} – {toFullDate12hr(eventEnd)}
                </p>

                <div className="mt-3">
                  <b className="text-bold work-sans-black mb-2">Location</b>
                  <p className="work-sans-black                                                                       ">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </EventContainer>
        </div>
        <Footer />
        {showModal && (
          <TicketModal
            event={event}
            isOpen={showModal}
            onClose={this.onOpenModal}
            gaTicketOptions={gaTicketOptions}
          />
        )}
      </div>
    );
  }
}

EventPage.propTypes = {
  event: PropTypes.object.isRequired,
  isEventLoaded: PropTypes.bool.isRequired,
  unfavoriteEvent: PropTypes.func.isRequired,
  followOrganizer: PropTypes.func.isRequired,
  setSelectedEvent: PropTypes.func.isRequired,
  favoriteEvent: PropTypes.func.isRequired,
  doesFollowOrganizer: PropTypes.bool.isRequired,
  isEventFavorited: PropTypes.bool.isRequired,
  gaTicketOptions: PropTypes.array.isRequired,
  fetchMarketplaceTickets: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  event: EventPageSelectors.makeSelectEventPage(),
  isEventLoaded: EventPageSelectors.isEventLoaded(),
  isEventFavorited: EventPageSelectors.isEventFavorited(),
  doesFollowOrganizer: EventPageSelectors.doesFollowOrganizer(),
  gaTicketOptions: EventPageSelectors.getGeneralAdmissionTicketGroupOptions(),
});

const mapDispatchToProps = {
  favoriteEvent: EventActions.favoriteEvent,
  unfavoriteEvent: EventActions.unfavoriteEvent,
  setSelectedEvent,
  followOrganizer: UserActions.followOrganizer,
  unfollowOrganizer: UserActions.unfollowOrganizer,
  fetchMarketplaceTickets: EventActions.fetchMarketplaceTickets,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EventPage);
