/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Modal from 'components/Modal';
import Truncate from './Truncate';

class ShowMoreText extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      truncated: false,
    };
  }

  static defaultProps = {
    lines: 3,
    more: 'Show more',
    less: 'Show less',
    anchorClass: '',
    onClick: undefined,
    expanded: false,
    width: 0,
    keepNewLines: false,
    expandInModal: false,
    truncatedEndingComponent: '... ',
  };

  static propTypes = {
    children: PropTypes.node,
    lines: PropTypes.number,
    more: PropTypes.node,
    less: PropTypes.node,
    anchorClass: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    expanded: PropTypes.bool,
    expandInModal: PropTypes.bool,
    width: PropTypes.number,
    keepNewLines: PropTypes.bool,
    truncatedEndingComponent: PropTypes.node,
  };

  componentDidMount() {
    this._isMounted = true;

    const _self = this;
    if (this._isMounted) {
      this.setState({
        expanded: _self.props.expanded,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleTruncate = truncated => {
    if (this._isMounted && truncated !== this.state.truncated) {
      this.setState({
        truncated,
      });
      if (truncated) {
        this.truncateRef.onResize();
      }
    }
  };

  toggleLines = event => {
    event.preventDefault();
    const _self = this;
    if (this._isMounted) {
      this.setState(
        {
          expanded: !this.state.expanded,
        },
        () => {
          if (_self.props.onClick) {
            _self.props.onClick(_self.state.expanded);
          }
        },
      );
    }
  };

  toggleModal = () => {
    const _self = this;
    if (this._isMounted) {
      this.setState(
        {
          expanded: !this.state.expanded,
        },
        () => {
          if (_self.props.onClick) {
            _self.props.onClick(_self.state.expanded);
          }
        },
      );
    }
  };

  render() {
    const {
      children,
      more,
      less,
      expandInModal,
      lines,
      anchorClass,
      className,
      width,
      keepNewLines,
      truncatedEndingComponent,
    } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <div className={className}>
        {((!expanded && !expandInModal) || !expanded) && (
          <Truncate
            width={width}
            lines={!expanded && lines}
            ellipsis={
              <span>
                {truncatedEndingComponent}
                <a href="" className={anchorClass} onClick={this.toggleLines}>
                  {more}
                </a>
              </span>
            }
            onTruncate={this.handleTruncate}
            ref={ref => (this.truncateRef = ref)}
          >
            {!expandInModal && keepNewLines
              ? children.split('\n').map((line, i, arr) => {
                  line = <span key={i}>{line}</span>;

                  if (i === arr.length - 1) {
                    return line;
                  }
                  return [line, <br key={`${i}br`} />];
                })
              : children}
          </Truncate>
        )}
        {!truncated && expanded && (
          <span>
            {' '}
            <a href="" className={anchorClass} onClick={this.toggleLines}>
              {less}
            </a>
          </span>
        )}

        {expandInModal && expanded && (
          <Modal isOpen header="" onClose={this.toggleModal}>
            <div className="p-3 work-sans">{children}</div>
          </Modal>
        )}
      </div>
    );
  }
}

export default ShowMoreText;
