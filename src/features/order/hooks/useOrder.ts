import { gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useSubscription,
  type QueryHookOptions,
  type MutationHookOptions 
} from '@apollo/client';
import type { Order } from '@/types/order.type';

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
      userInfoId,
      paymentType,
      items {
        productId,
        quantity,
      }
  }
}
`;


export const useOrder = (userId?: number) => {
  const { data, loading, error, refetch } = useQuery<{ order: Order }>(GET_ORDER, {
    variables: {userId: userId },
  });

  const [createOrder, { loading: creating, error: createError }] = useMutation(CREATE_ORDER);

  const handleCreateOrder = async (createOrderData: Partial<Order>) => {
      
        console.log('handleCreateOrder called with:', createOrderData);

      const { data: result } = await createOrder({
        variables: {
          createOrderInput:createOrderData
        }
      });
      
      await refetch();
      
      return result;
  };

  return {
    orders: data?.orders || [],
    loading,
    error,
    creating,
    createOrder: handleCreateOrder,
    refetch
  };
};


