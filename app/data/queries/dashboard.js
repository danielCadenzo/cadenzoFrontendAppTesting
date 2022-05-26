export const GET_VIEWER_INFO = `
{
  viewer{
    id
    email
    name
    username
    avatar
    databaseId
    isOrganizer
    phoneNumber
    is2faEnabled
    venues {
      name
      images
      avatar
      id
      rId
    }
    attachedArtists {
      name
      avatar
      id
      rId
    }
  }
}
`;

export const GET_VIEWER_ORGANIZER_EVENTS = `
query($email: String){
  events(organizer_Email: $email){
    edges {
      node {
        id
        title
        startDate
      }
    }
  }
}
`;
