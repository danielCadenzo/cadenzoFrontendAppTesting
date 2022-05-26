export const FETCH_EVENT_QUERY = `query($id:ID!){
  event(id: $id) {
    id
    title
    startDate
    endDate
    photos
    description
    isFavorited
    address
    coverImage
    venueMap {
      seatingMap
      seatingChart
      mapName
    }
    organizer {
      id
      username
      doesFollow
    }
    productGroups {
      edges {
        node {
          name
          basePrice
          description
          id
        }
      }
    }
  }
}`;

export const GET_DISCOUNT_CODE_INFO = `
query($ids: [ID], $discountCode: String){
  checkDiscountCode(ticketGroupIds: $ids, discountCode: $discountCode){
    discountType
    id
    discountAmount
    ticketGroup {
      id
    }
  }
}
`;

export const COMPLETE_DIRECT_CHECKOUT = `
query($ids: [ID], $amounts: [Int], $email: String){
  getDirectCheckoutTickets(email: $email, ticketGroupIds: $ids, checkoutAmounts: $amounts)
}
`;
