import { gql } from '@apollo/client';


export const CREATE_ORDER = gql`
mutation($createOrderInput: CreateOrderInput!){
  createOrder(createOrderInput: $createOrderInput) {
      userId,
      userInfoId,
      paymentType,
      items {
        productId,
        quantity,
      }
  }
}
`;