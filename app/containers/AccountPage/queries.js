export const REQUEST_2FA_CODE = `{
    viewer {
      ping2fa
    }
  }`;

export const VERIFY_2FA_CODE = `query($code: String!){
    viewer {
      verify2faCode(code: $code, enableTwoFactor: true)
    }
  }`;

export const UPDATE_PASSWORD = `mutation($confirmNewPass:String!, $newPass:String!, $confirmPass:String!){
  resetPassword(confirmNewPassword: $confirmNewPass, newPassword: $newPass, oldPassword: $confirmPass){
    success
    msg
  }
}`;

export const REQUEST_NEW_PHONE_NUMBER_2FA = `query($phoneNumber: String){
  viewer {
    ping2fa(phoneNumber: $phoneNumber)
  }
}`;

export const VERIFY_NEW_PHONE_NUMBER = `query($phoneNumber: String, $code: String! ){
  viewer {
    verify2faCode(phoneNumber: $phoneNumber, setNew: true, code: $code)
  }
}`;

export const UPDATE_PROFILE = `mutation($email: String, $name: String){
  updateProfile(email: $email, name: $name){
    success
  }
}`;

export const REMOVE_PAYMENT_METHOD = `mutation($pmId: String!){
  removePaymentMethod(paymentMethodId: $pmId){
    success
  }
}`;

export const ADD_PAYMENT_METHOD = `mutation($cardNumber: String!, $cvc: String!, $expiry: String!, $zipCode: Int!){
  addPaymentMethod(cardNumber: $cardNumber, cvc:$cvc, expiry:$expiry, zipCode: $zipCode){
    success
  }
}`;

export const FETCH_PAYMENT_METHODS = `{
  viewer{
    paymentMethods
  }
}`;

export const SELL_TICKET = `
mutation($ticketId: ID!,  $price: Int!,$isOnMarketplace: Boolean!){
  placeTicketOnMarketplace(id:$ticketId,  price: $price, isOnMarketplace: $isOnMarketplace ){
    success
  }
}`;
