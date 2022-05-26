import React from 'react';
import styled from 'styled-components';

function MainInfo(props) {
  const MainInfoBox = styled.div`
    padding-left: 50px;
    padding-right: 50px;
    text-align: center;
  `;

  const MiniInfoBox = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const LeftBottom = styled.div`
    padding-right: 35px;
  `;

  const RightBottom = styled.div`
    padding-left: 35px;
  `;

  const SectionTitle = styled.h2`
    font-size: 30px;
  `;

  const Amount = styled.h1`
    font-size: 50px;
    color: #6472ea;
  `;

  const Header = styled.h3`
    font-family: 'Work Sans';
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 17px;
  `;

  const Stat = styled.h2`
    font-family: 'Work Sans';
    font-style: normal;
    font-weight: 900;
    line-height: 17px;
    font-size: 2em;
    color: #6472ea;
    margin-top: 8px;
  `;

  return (
    <MainInfoBox className="p-3">
      <Header>Event Revenue</Header>
      <Stat>${props.totalRevenue}</Stat>
      <br />
      <Header>Revenue Per Cap</Header>
      <Stat>${props.revenuePerCap}</Stat>
      <br />
      {false && (
        <MiniInfoBox>
          <LeftBottom>
            <Header>Event Views</Header>
            <Stat>12,132</Stat>
          </LeftBottom>
          <RightBottom>
            <Header>Unique Visitors</Header>
            <Stat>2,932</Stat>
          </RightBottom>
        </MiniInfoBox>
      )}
    </MainInfoBox>
  );
}

export default MainInfo;
