export const GET_SELECTED_EVENT = `
  query($eventGid: ID){
    event(id:$eventGid) {
      id
      title
      startDate
      endDate
      description
      coverImage
      address
      type
      isPublic
      totalRevenue
      grossRevenue
      revenuePerCap
      ticketPrimaryRevenue {
        date
        value
        label
      }
      productGroups {
        edges {
          node {
            ticketHolders {
              email
              amountHeld
              avatar
            }
            ticketAmt
            amtSold
            name
            id
            description
            isMarketplaceAllowed
            basePrice
            maxMarkupPrice
          }
        }
      }
    }
    analytics{
      monthlyPrimarySales(eventId: $eventGid) {
        date
        value
      }
      monthlySecondarySales(eventId: $eventGid){
        date
        value
      }
    }
  }
`;
