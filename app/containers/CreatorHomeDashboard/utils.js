

export function getOtherProfileFromBooking(isUserTheVenue, booking) {
  switch (isUserTheVenue) {
    case false:
      return {
        profile: booking.venue,
      };
    case true:
      return {
        profile: booking.performer,
      };

    default:
      return {
        profile: booking.performer,
      };
  }
}