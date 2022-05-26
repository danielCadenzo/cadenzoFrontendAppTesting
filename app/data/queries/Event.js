export const FAVORITE_EVENT = `
  mutation($ids: [ID]!){
    favoriteEvent(ids: $ids) {
      success
    }
  }
`;

export const UNFAVORITE_EVENT = `
  mutation($ids: [ID]!){
    unfavoriteEvent(ids: $ids) {
      success
    }
  }
`;

export const DELETE_EVENT = `mutation($id: ID!){
  deleteEvent(id: $id) {
    success
  }
}`;

export const UPDATE_EVENT_COVER = `mutation($id: ID!, $attachedFile: Upload!){
  updateEventCover(id: $id, attachedFile: $attachedFile) {
    success
  }
}`;

export const UPLOAD_IMAGE = `mutation($attachedFile: Upload!, $filename: String!){
  updateEventCover(attachedFile: $attachedFile, filename: $filename) {
    success
    coverUrl
  }
}`;

export const UPLOAD_GENERIC_IMAGE = `mutation($attachedFile: Upload!, $filename: String!){
  uploadImage(attachedFile: $attachedFile, filename: $filename) {
    success
    imageUrl
  }
}`;

export const MARKETPLACE_TICKETS = `query($id:ID!){
  tickets(productType_Event_Id:$id, isOnMarketplace: true) {
    edges{
      node{
        marketplacePrice
        id
        productType {
          name
          description
          id
        }
      }
    }
  }
}`;

export const EVENT_ATTENDEE_LIST = `
query EventUserList($email: String, $viewLevel:AttendeeScope, $guestStatus: AttendeeStatus, $eventId:ID) {
  viewer {
    attendeeListCount(eventId: $eventId) {
      label
      value
    }
    attendeeSearch(email: $email, viewLevel: $viewLevel, guestStatus: $guestStatus, eventId: $eventId) {
      id
      email
      avatar
    }
  }
}
`;
