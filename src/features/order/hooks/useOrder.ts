import { 
  useQuery, 
  useMutation, 

} from '@apollo/client';
import type { Order,CreateOrderRequest } from '@/types/order.type';

import { GET_ORDER, CREATE_ORDER,GET_STATS,GET_ORDER_BY_USER } from '@/queries/order.queries';




export const useOrder = (userId?: number) => {
  const { data, loading, error, refetch } = useQuery<{ orders: Order[] }>(GET_ORDER, {
    variables: {userId: userId },
    skip: !userId,
  });

  const { data: statsData } = useQuery(GET_STATS);
  const [createOrderMutation, { loading: creating, error: createError }] = useMutation(CREATE_ORDER);
  const { data: userOrdersData } = useQuery<{ orders: Order[] }>(GET_ORDER_BY_USER);



  const handleCreateOrder = async (createOrderData: CreateOrderRequest) => {
    console.log('handleCreateOrder called with:', createOrderData);

    // Validate required fields
    if (!createOrderData.userId) {
      throw new Error('userId và userInfoId là bắt buộc');
    }

    if (!createOrderData.items || createOrderData.items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    try {
      const { data: result } = await createOrderMutation({
        variables: {
          createOrderInput: createOrderData
        }
      });
      
      await refetch();
      return result;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  return {
    orders: data?.orders || [],
    orderStats: statsData?.orderStats || {},
    userOrders: userOrdersData?.orders || [],
    loading,
    error: error || createError,
    creating,
    createOrder: handleCreateOrder,
    refetch
  };
};

