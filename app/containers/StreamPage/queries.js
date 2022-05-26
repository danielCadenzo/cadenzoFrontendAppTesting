export const TICKET_EVENT_FETCH = `query ($id: UUID){
  tickets(uuid: $id) {
    edges {
      node {
        id
        event {
          title
          startDate
        }
      }
    }
  }
}`;
