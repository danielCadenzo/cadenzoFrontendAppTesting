'use es6';

export const CREATE_ARTIST_PROFILE = `mutation($performanceTypes: [String], $genres: [String], $socialLinks:[String], $name: String, $hometown: AddressInputField, $description: String, $avatar: String, $images: [String]!){
  createArtistProfile(genres: $genres, performanceTypes: $performanceTypes, socialLinks:$socialLinks, hometown: $hometown, name: $name, description: $description, avatar: $avatar, , images: $images) {
    success
  }
}`;

export const CREATE_HOST_PROFILE = `mutation($preferredPerformances: [String], $capacity: String!, $socialLinks:[String], $name: String!, $spaceType: String!, $address: AddressInputField, $description: String!, $avatar: String!){
  createVenueProfile(capacity: $capacity, preferredPerformances: $preferredPerformances, socialLinks:$socialLinks, spaceType: $spaceType, address: $address, name: $name, description: $description, images: $avatar) {
    success
  }
}`;

export const CREATE_HOST_PROFILE_WITH_EXACT_CAPACITY = `mutation($preferredPerformances: [String], $exactCapacity: Int, $capacity: String!, $spaceType: String!, $socialLinks:[String], $name: String!, $address: AddressInputField, $description: String!, $avatar: String!){
  createVenueProfile(capacity: $capacity,exactCapacity:$exactCapacity, preferredPerformances: $performanceTypes, socialLinks:$socialLinks, spaceType: $spaceType, address: $address, name: $name, description: $description, images: $avatar) {
    success
  }
}`;

export const EDIT_HOST_PROFILE = `mutation($id: ID!, $preferredPerformances: [String], $capacity: String!, $anemities: [String], $socialLinks:[String], $name: String!, $spaceType: String!, $address: AddressInputField, $description: String!, $avatar: String!, $images: [String!]){
  editVenueProfile(id: $id, capacity: $capacity, preferredPerformances: $preferredPerformances, socialLinks:$socialLinks, address: $address, anemities: $anemities, name: $name, spaceType: $spaceType, description: $description, avatar: $avatar, images: $images) {
    success
  }
}
`;

export const EDIT_HOST_PROFILE_WITH_EXACT_CAPACITY = `mutation($id: ID!, $preferredPerformances: [String],$exactCapacity: Int, $capacity: String!, $spaceType: String!, $anemities: [String] $socialLinks:[String], $name: String!, $address: AddressInputField, $description: String!, $avatar: String!, $images: [String!]){
  editVenueProfile(id: $id, capacity: $capacity,exactCapacity:$exactCapacity, preferredPerformances: $preferredPerformances, socialLinks:$socialLinks, spaceType: $spaceType, anemities: $anemities, address: $address, name: $name, description: $description, avatar: $avatar, images: $images) {
    success
  }
}
`;

export const EDIT_ARTIST_PROFILE_MUTATION = `mutation($id: ID!, $performanceTypes: [String], $genres: [String], $socialLinks:[String], $name: String!, $hometown: AddressInputField, $description: String!, $avatar: String!, $images: [String]!){
  editArtistProfile(id: $id, genres: $genres, performanceTypes: $performanceTypes, socialLinks:$socialLinks, hometown: $hometown, name: $name, description: $description, avatar: $avatar, images: $images) {
    success
    msg
  }
}`;
