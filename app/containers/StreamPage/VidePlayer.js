import React from 'react';
import videojs from 'video.js';
import './citytheme.scss';
import './city.scss';
import './Videoplayer.scss';
import styled from 'styled-components';

const Vidya = styled.video`
  max-width: 1080px;
`;

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    this.state = {
      videoReady: false,
    };
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      this.setState({ videoReady: true });
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  handleRightClick = e => {
    e.preventDefault();
    return false;
  };

  render() {
    return (
      <div className="d-flex flex-justify-center full-width mt-3">
        <div data-vjs-player>
          <Vidya
            onContextMenu={this.handleRightClick}
            ref={node => (this.videoNode = node)}
            className="video-js vjs-theme-city"
          />
        </div>
      </div>
    );
  }
}
