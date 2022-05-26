export const FETCH_CHATS = `
query($id:  UUID!){
  chatrooms(id: $id){
    edges {
      node{
        messages {
          edges {
            node {
              content
              thread {
                id
              }
              parent {
                id
              }
              sentAt
              sender {
                id
                name
                avatar
              }
            }
          }
        }
      }
    }
  }
}
`;

export const FETCH_CHAT_MESSAGES = `
query($id:  UUID!){
  chatroom(id: $id){
    messages {
      edges {
        node {
          content
          thread {
            id
          }
          parent {
            id
          }
          sentAt
          sender {
            id
            name
            avatar
          }
        }
      }
    }
  }
}
`;
