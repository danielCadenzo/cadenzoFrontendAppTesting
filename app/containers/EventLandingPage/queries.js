export const LANDING_PAGE_EVENTS = `query($startDate: DateTime!, $endDate: DateTime){
  events(isPublic: true, startDate_Gte: $startDate, endDate_Lte: $endDate){
    edges {
      node {
        id
        title
        startDate
        coverImage
        isFavorited
      }
    }
  }
}`;

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
