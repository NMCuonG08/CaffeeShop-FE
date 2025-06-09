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
        id: product_id,
        name: product,
        price: current_retail_price,
        image: product_image_cover
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