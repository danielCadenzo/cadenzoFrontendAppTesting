export const UPDATE_VENUE_MAP = `mutation($id: ID!, $mapName: String!, $seatingChart:JSONString, $seatingMap:JSONString){
  editVenueMap(id: $id, mapName: $mapName, seatingChart:$seatingChart, seatingMap:$seatingMap) {
    success
    venueMap {
      id
      seatingMap
      seatingChart
      creator {
        id
      }
    }
  }
}`;

export const CREATE_VENUE_MAP = `mutation($mapName: String!, $seatingChart:JSONString, $seatingMap:JSONString){
  createVenueMap(mapName: $mapName, seatingChart:$seatingChart, seatingMap:$seatingMap) {
    success
    venueMap {
      id
      seatingMap
      mapName
      seatingChart
      creator {
        id
      }
    }
  }
}`;

export const FETCH_VENUE_MAP_LIST = `query($email: String!){
  venueMaps(creator_Email: $email) {
    edges{
      node {
        id
        mapName
      }
    }
  }
}`;

export const LOAD_VENUE_MAP = `query($id: ID!){
  venueMap(id: $id){
    id
    mapName
    seatingMap
    seatingChart
  }
}`;
