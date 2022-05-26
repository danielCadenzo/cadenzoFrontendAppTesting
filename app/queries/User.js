export const USER_SEARCH_BY_EMAIL = `
query($search:String){
  users(email_Icontains: $search, first: 15){
    edges {
      node {
        email
        avatar
      }
    }
  }
}`;

export const CHECK_IN_ALL_USER_TICKETS = `
mutation($id: ID!, $userId: ID!){
  checkInUser(id: $id, userId: $userId) {
    success
  }
}`;
