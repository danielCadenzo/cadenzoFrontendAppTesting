import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import styled from 'styled-components';
import Routes from 'data/Routes';
import { dateTimeToHumanReadable } from '../../utils/helpers';

const Wrapper = styled.div`
  max-height: 200px;
  min-width: 200px;
  color: black;
`;
class EventListItem extends PureComponent {
  handleClick = () => {
    const { onClick } = this.props;
    onClick(this.props.id);
  };

  render() {
    const { onClick } = this.props;
    return (
      <a
        onClick={this.handleClick}
        href={!onClick && Routes.eventDashboard(this.props.id)}
      >
        <Wrapper className="d-flex flex-column">
          <div className="d-flex flex-justify-between p-2">
            <div className="d-flex flex-column">
              <div className=""> {this.props.eventName} </div>
              <div className="">
                {dateTimeToHumanReadable(this.props.startDate)}
              </div>
            </div>
          </div>
        </Wrapper>
      </a>
    );
  }
}

EventListItem.defaultProps = {};

EventListItem.propTypes = {
  eventName: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

EventListItem.fragments = {
  comment: gql`
    fragment EventListItem on EventNode {
      title
      id
      startDate
    }
  `,
};

export default EventListItem;
