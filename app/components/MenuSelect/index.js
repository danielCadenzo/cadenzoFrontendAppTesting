import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const MenuWrapper = styled.div`
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto,
    Helvetica Neue, sans-serif;
  font-size: 14px;
  line-height: 1.43;
  -webkit-font-smoothing: antialiased;
  --page-shell-max-content-width: 1760px;
  --header-brand-color: #ff385c !important;
  box-sizing: border-box;
  background: rgb(255, 255, 255) !important;
  border-radius: 12px !important;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 16px !important;
  color: rgb(34, 34, 34) !important;
 
  padding: 8px 0px !important;
  position: absolute;
  right: 0px;
  max-height: calc(100vh - 100px) !important;
  overflow-y: auto !important;
  z-index: 3 !important;
  min-width: 240px !important;

  
  @media ${deviceMax.mobileL} {
    bottom: 85%;
  }
`;

const MenuItem = styled.div`
  -webkit-font-smoothing: antialiased;
  --page-shell-max-content-width: 1760px;
  --header-brand-color: #ff385c !important;
  box-sizing: border-box;
  appearance: none !important;
  background: transparent !important;
  border: 0px !important;
  color: #222222 !important;
  cursor: pointer !important;
  display: flex !important;
  font-family: inherit !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 18px !important;
  margin: 0px !important;
  outline: none !important;
  overflow: visible !important;
  padding: 12px 16px !important;
  text-align: inherit !important;
  text-decoration: none !important;
  user-select: auto !important;
  white-space: nowrap !important;
  width: 100% !important;

  &:hover {
    background-color: #e0d8f3 !important;
  }
`;

class MenuSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    wrapperStyles: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
  };

  addMouseDownListener = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  removeMouseListener = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  componentDidMount() {
    this.addMouseDownListener();
  }

  componentWillUnmount() {
    this.removeMouseListener();
  }

  toggleMenu = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.removeMouseListener();
    } else {
      this.addMouseDownListener();
    }
    this.setState({ isOpen: !isOpen });
  };

  handleSelectItem = value => {
    const { onSelect } = this.props;
    onSelect(value);
    this.toggleMenu();
  };

  handleClickOutside = event => {
    const { isOpen } = this.state;
    if (isOpen && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleMenu();
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  renderOption = option => {
    const shouldRenderHeader = !!option.options;
    return (
      <Fragment>
        {shouldRenderHeader && (
          <MenuItem className="py-1">{option.text}</MenuItem>
        )}
        {!shouldRenderHeader && (
          <MenuItem onClick={() => this.handleSelectItem(option)}>
            {option.text}
          </MenuItem>
        )}
        {shouldRenderHeader &&
          option.options.map(opt => {
            const selectHandler = () => this.handleSelectItem(opt);
            return (
              <MenuItem onClick={selectHandler} onKeyPress={selectHandler}>
                {opt.text}
              </MenuItem>
            );
          })}
      </Fragment>
    );
  };

  renderOptions = () => {
    const { options } = this.props;
    return options.map(opt => this.renderOption(opt));
  };

  render() {
    const { children, wrapperStyles, menuChildren } = this.props;
    const { isOpen } = this.state;

    return (
      <div ref={this.setWrapperRef}>
        <div onClick={this.toggleMenu}>{{ ...children }}</div>
        <MenuWrapper
          style={wrapperStyles}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          {this.renderOptions()}
          {menuChildren}
        </MenuWrapper>
      </div>
    );
  }
}

MenuSelect.defaultProps = {
  options: [],
  wrapperStyles: {},
};

export default MenuSelect;
