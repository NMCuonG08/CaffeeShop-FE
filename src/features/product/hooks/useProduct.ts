import { gql, useQuery, useMutation } from '@apollo/client';

const GET_PRODUCT = gql`
  query GetProduct($id: Float!) {
    getProduct(id: $id) {
      product_id
      product
      product_category
      product_description
      product_group
      product_image_cover
      product_type
      promo_yn
      current_retail_price
      current_wholesale_price
      feedbacks {
        id
        user {
          id
          picture
          firstName
          lastName
          email
        }
        rating
        content
        createdAt
      }
      averageRating
      totalFeedbacks
    }
  }
`;

// const GET_PRODUCTS = gql`
//   query GetProducts($filter: ProductFilter) {
//     getProducts(filter: $filter) {
//       product_id
//       product
//       product_category
//       current_retail_price
//       product_image_cover
//       averageRating
//     }
//   }
// `;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product_id
      product
      message
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Float!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      product_id
      product
      message
    }
  }
`;

const GET_PRODUCT_NAME = gql`
query GetProduct($id: Float!) {
    getProduct(id: $id) {
      product_id
      product
    }
  }`

export const useProduct = (id: number) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.getProduct,
    loading,
    error,
  };
};
export const useProductName = (id: number) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_NAME, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.getProduct,
    loading,
    error,
  };
};

// export const useProducts = (filter?: any) => {
//   const { data, loading, error } = useQuery(GET_PRODUCTS, {
//     variables: { filter },
//   });

//   return {
//     products: data?.getProducts,
//     loading,
//     error,
//   };
// };

export const useCreateProduct = () => {
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT);
  
  return {
    createProduct,
    loading,
    error,
  };
};

export const useUpdateProduct = () => {
  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT);
  return {
    updateProduct,
    loading,
    error,
  };
};