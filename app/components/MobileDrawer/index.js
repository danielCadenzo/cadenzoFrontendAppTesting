import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { deviceMax } from '../../constants/ResponsiveSizing/deviceSize';

const Wrapper = styled.div`
  z-index: 2;
  visibility: hidden;
  height: 100%;
  display: none;
  overflow-y: auto;

  @media ${deviceMax.mobileL} {
    z-index: 3;
    position: fixed;
    display: flex;
    visibility: visible;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: ${props => props.height};

    bottom: 0px;
    background-color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transition: all 1s;
    margin-bottom: 80px;
  }
`;

function MobileDrawer({
  children,
  height,
  className,
  isOpen: drawerIsOpen,
  drawerContent,
  alwaysShowPartial,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const showFilterDrawer = () => setIsOpen(!isOpen);

  const drawerHeight = useMemo(() => {
    if (height) return height;
    if (isOpen || drawerIsOpen) return '80%';
    return alwaysShowPartial ? '5%' : '0px';
  }, [height, isOpen]);

  useEffect(() => {
    setIsOpen(drawerIsOpen);
  }, [drawerIsOpen]);

  return (
    <>
      <Wrapper
        className={className}
        height={drawerHeight}
        showFilterDrawer={showFilterDrawer}
      >
        {alwaysShowPartial && (
          <button type="button" onClick={showFilterDrawer}>
            {drawerContent}
          </button>
        )}
        {children}
      </Wrapper>
    </>
  );
}

MobileDrawer.propTypes = {
  className: PropTypes.string,
  drawerContent: PropTypes.any,
  alwaysShowPartial: PropTypes.bool,
  height: PropTypes.string,
  isOpen: PropTypes.bool,
};

MobileDrawer.defaultProps = {
  alwaysShowPartial: false,
  isOpen: false,
};

export default MobileDrawer;
