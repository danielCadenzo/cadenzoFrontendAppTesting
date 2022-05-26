export const CREATE_EVENT = `
mutation($address: String!, $title: String!, $type: EventTypeEnum!, $startDate: DateTime!, $endDate: DateTime!, $description: String, $coverUrl: String!){
  createEvent(address: $address, title: $title, type: $type, startDate: $startDate, endDate: $endDate, description: $description, coverImage: $coverUrl) {
    success
    event {
      id
    }
  }
}
`;

export const UPDATE_EVENT = `
mutation($id: ID!, $address: String, $title: String!, $type: EventTypeEnum, $startDate: DateTime, $endDate: DateTime, $description: String){
  editEvent(id: $id, address: $address, title: $title, type: $type, startDate: $startDate, endDate: $endDate, description: $description) {
    success
  }
}
`;

export const CREATE_TICKETS = `
mutation($eventId: ID!, $basePrice: Float!, $amount: Int!, $isMarketplaceAllowed:Boolean!, $maxMarkupPrice: Float, $title: String!, $description:String){
  createTicketForEvent(basePrice: $basePrice, amount: $amount, eventId: $eventId, isMarketplaceAllowed: $isMarketplaceAllowed, maxMarkupPrice: $maxMarkupPrice, name: $title,
  	description: $description){
    success
  }
}
`;

export const EDIT_TICKETS_GROUP = `
mutation($id: ID!, $basePrice: Float!, $amount: Int!, $isMarketplaceAllowed:Boolean!, $maxMarkupPrice: Float, $title: String!, $description:String){
  editTicketForEvent(basePrice: $basePrice, amount: $amount, id: $id, isMarketplaceAllowed: $isMarketplaceAllowed, maxMarkupPrice: $maxMarkupPrice, title: $title,
  	description: $description){
    success
  }
}
`;

export const DELETE_TICKET_GROUP = `
mutation($id: ID!){
  deleteTicketsForEvent(id: $id){
    success
  }
}
`;

export const SET_PUBLISH_STATUS = `
mutation($publishStatus: Boolean!, $id: ID!){
  setPublishStatusForEvent(id: $id, publishState: $publishStatus) {
    success
  }
}`;
