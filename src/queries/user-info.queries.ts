import { gql } from '@apollo/client';


export const GET_USER_INFO = gql`
  query($userInfoId: Int!){
  userInfo(id: $userInfoId) {
    fullName,
    email,
    district,
    phone,
    city,
    address,
    ward
    user {
      id,
      firstName
    }
  }
}
`;
export const UPDATE_USER_INFO = gql`
mutation($updateUserInfoId: Int!, $updateUserInfo: UpdateUserInfoInput!){
  updateUserInfo(id: $updateUserInfoId, updateUserInfo: $updateUserInfo) {
    fullName,
    email,
    district,
    phone,
    city,
    address,
    ward

  }
}
`;


