import styled from 'styled-components';

export default styled.div`
  background-color: black;
  background: linear-gradient(93.34deg, #5926cc 0%, #a84bf5 100%);
  width: 100%;
  height: 400px;
  ${({ image }) => (!image ? '' : `background: url(${image});`)}
  box-shadow: inset 0 0 0 1000px rgba(0,0,0,.4);
  background-size: auto;
  background-position: center;
`;
