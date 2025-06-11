import { gql } from '@apollo/client';

export const GET_ORDER = gql`
query GetOrders($userId: Int) {
  orders(userId: $userId) {
    id
    status
    userId
    totalAmount
  }
}
`


export const CREATE_ORDER = gql`
mutation($createOrderInput: CreateOrderInput!){
  createOrder(createOrderInput: $createOrderInput) {
      userId,
      paymentType,
      items {
        unitPrice,
        productId,
        quantity,
      }
  }
}
`;


export const GET_STATS  = gql`
query GetStats {
  orderStats
  }
`


export const GET_ORDER_BY_USER = gql`
query{
  orders {
    id,
    createdAt,
    totalAmount,
    status,
    paymentType,
    items {
      id,
      orderId,
      quantity,
      unitPrice,
      product {
        product_id,
        name: product,
        price: current_retail_price,
        image
      }
    },
    userInfo {
      id,
      fullName,
      email,
      phone,
      address,
      city,
      district,
      ward
    },
  }
}`