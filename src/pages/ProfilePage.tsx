import ShippingForm from '@/features/payment/components/ShippingForm'
import type { ShippingInfo } from '@/features/payment/types/payment.type';
import  { useState } from 'react'

const ProfilePage = () => {

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        notes: ''
      });
      


  return (
    <div>
        <ShippingForm   shippingInfo={shippingInfo}
              onChange={setShippingInfo}/>
    </div>
  )
}

export default ProfilePage