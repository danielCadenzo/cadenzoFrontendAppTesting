/**
 *
 * LandingPage
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { createGQLQuery } from 'data/api';
import { flattenGQLEdges } from 'utils/helpers';
import Routes from 'data/Routes';
import background from 'images/backgrounds/main page.jpg';
import * as EventActions from 'data/actions/EventActions';
import Footer from './UniversalFooter';
import EventCard from './EventCard';
import * as LandingPageActions from './actions';
import * as LandingPageSelectors from './selectors';
import ShareModal from './ShareModal';
import SearchBar from './SearchBar';
import { LANDING_PAGE_EVENTS } from './queries';

const BodyContainer = styled.div`
  max-width: 1980px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 18px 0 72px 0;
  width: 100%;
  justify-content: center !important;
`;

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
    width: 100%;
    background-position-x: center;
    max-height: 400px;
    background-size: cover;
    height: 100%;
    background-image: url("${background}"), linear-gradient(45deg, white, white);
    background-position: center;
    @media (max-width: 500px) {
      background-image: none;
    }
`;

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      endDate: null,
      showShareModal: false,
      shareModalGid: '',
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState) {
      return;
    }
    const { startDate: prevStart, endDate: prevEnd } = prevState;
    const { startDate, endDate } = this.state;
    const endChanged = !(endDate <= prevEnd && endDate >= prevEnd);
    const startChanged = !(startDate <= prevStart && startDate >= prevStart);
    if (startChanged || endChanged) {
      this.fetchEvents();
    }
  }

  fetchEvents = () => {
    const { fetchViewableEvents } = this.props;
    const { startDate } = this.state;
    let { endDate } = this.state;
    const isToday =
      endDate && new Date().toDateString() === endDate.toDateString();
    if (isToday) {
      endDate.setDate(startDate.getDate() + 1);
      endDate = endDate.toISOString();
    }
    createGQLQuery(LANDING_PAGE_EVENTS, {
      startDate: startDate.toISOString(),
      endDate,
    }).then(data => {
      if (data.events.edges) {
        fetchViewableEvents(flattenGQLEdges(data.events.edges));
      }
    });
  };

  onFavoriteEvent = (eventGid, isFavorited, callback) => {
    const { favoriteEvent, unfavoriteEvent } = this.props;
    if (!isFavorited) {
      favoriteEvent(eventGid).then(data => {
        if (data.favoriteEvent.success) {
          callback(true);
        }
      });
    } else {
      unfavoriteEvent(eventGid).then(data => {
        if (data.unfavoriteEvent.success) {
          callback(false);
        }
      });
    }
  };

  onShareEvent = eventGid => {
    this.setState({
      showShareModal: true,
      shareModalGid: eventGid,
    });
  };

  onSelectEvent = event => {
    if (!event) return null;
    const { id } = event;
    // redirect to that event's page
    window.location.href = Routes.eventPage(id);
    return null;
  };

  handleDateChange = dates => {
    const [startDate, endDate] = dates;
    this.setState({ startDate, endDate });
  };

  render() {
    const { events } = this.props;
    const { startDate, endDate, showShareModal, shareModalGid } = this.state;

    const sortedEvents = events.sort((a, b) => {
      if (a.startDate < b.startDate) {
        return -1;
      }
      if (a.startDate === b.startDate) {
        return 0;
      }
      return 1;
    });

    return (
      <Wrapper>
        <Helmet>
          <title>Cadenzo - Entertainment Reimagined</title>
          <meta
            name="description"
            content="Cadenzo - Entertainment Reimagined"
          />
        </Helmet>
        <Banner className="d-flex flex-column full-width flex-items-center">
          <SearchBar
            onDateChange={this.handleDateChange}
            startDate={startDate}
            endDate={endDate}
            onSubmit={this.fetchEvents}
          />
        </Banner>
        <BodyContainer>
          <ShareModal eventGid={shareModalGid} isOpen={showShareModal} />
          {sortedEvents.map(event => (
            <EventCard
              image={event.coverImage}
              date={event.startDate}
              event={event}
              id={event.id}
              onFavorite={this.onFavoriteEvent}
              isFavorited={event.isFavorited}
              onShare={() => {}}
              title={event.title}
              onClick={this.onSelectEvent}
            />
          ))}
        </BodyContainer>
        <Footer />
      </Wrapper>
    );
  }
}

LandingPage.propTypes = {
  favoriteEvent: PropTypes.func.isRequired,
  unfavoriteEvent: PropTypes.func.isRequired,
  fetchViewableEvents: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  events: LandingPageSelectors.getViewableEvents(state),
});

const mapDispatchToProps = {
  favoriteEvent: EventActions.favoriteEvent,
  unfavoriteEvent: EventActions.unfavoriteEvent,
  fetchViewableEvents: LandingPageActions.fetchViewableEvents,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
