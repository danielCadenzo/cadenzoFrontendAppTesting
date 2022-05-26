export const UPLOAD_GENERIC_FILE = `mutation($attachedFile: Upload!, $filename: String!){
  uploadImage(attachedFile: $attachedFile, filename: $filename) {
    success
    imageUrl
  }
}`;
