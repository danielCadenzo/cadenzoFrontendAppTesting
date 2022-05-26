export const FETCH_REVENUE_FOR_TIME_PERIOD = `query($eventStatus: [EventStatus], $dateTimeStart: DateTime!, $dateTimeEnd: DateTime!,  $dateStart: Date!, $dateEnd: Date!){
  eventsFilter(startDate_Gte: $dateTimeStart, endDate_Lte: $dateTimeEnd) {
    edges {
      node {
        totalRevenue
        grossRevenue
        title
        id
      }
    }
  }
  viewer{
    revenueByTicketGroup(settleStatus: $eventStatus, dateEnd: $dateEnd, dateStart: $dateStart){
      label
      value
    }
  }
}`;

export const FETCH_REVENUE_BY_TICKET_GROUP_FOR_TIME_PERIOD = `query($settleStatus: [EventStatus], $dateStart: Date!, $dateEnd: Date!){
  viewer{
    revenueByTicketGroup(settleStatus: $settleStatus, dateEnd: $dateEnd, dateStart: $dateStart){
      label
      value
    }
  }
}`;
