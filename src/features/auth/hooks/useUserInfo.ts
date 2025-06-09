import { useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useSubscription,
  type QueryHookOptions,
  type MutationHookOptions 
} from '@apollo/client';
import { gql } from '@apollo/client';

import {type UserInfo } from '@/types';
import {type UPDATE_USER_INFO } from '@/queries';

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
}`;

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


export const useUserInfo = (userId?: number) => {
  const { data, loading, error, refetch } = useQuery<{ userInfo: UserInfo }>(GET_USER_INFO, {
    variables: {userInfoId: userId }, // userId thay vì userInfoId
  });

  const [updateUserInfo, { loading: updating, error: updateError }] = useMutation(UPDATE_USER_INFO);

  const handleUpdateUserInfo = async (updateData: Partial<UserInfo>) => {
      
    console.log('handleUpdateUserInfo called with:', updateData);

      const { data: result } = await updateUserInfo({
        variables: {
          updateUserInfoId: userId, // userId thay vì userInfoId
          updateUserInfo: updateData
        }
      });
      
      await refetch();
      
      return result;
  };

  return {
    userInfo: data?.userInfo,
    loading,
    error,
    updating,
    updateError,
    updateUserInfo: handleUpdateUserInfo,
    refetch
  };
};