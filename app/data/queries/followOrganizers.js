export const FOLLOW_ORGANIZER = `mutation($oids: [ID]!){
    followOrganizer(oids: $oids) {
      success
    }
  }`;

export const UNFOLLOW_ORGANIZER = `mutation($oids: [ID]!){
  unfollowOrganizer(oids: $oids) {
    success
  }
}`;
