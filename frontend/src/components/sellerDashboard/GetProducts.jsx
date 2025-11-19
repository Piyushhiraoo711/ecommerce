import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerProducts } from '../../slice/productSlice';
import SellerProductsCard from '../card/SellerProductCard';

const GetProducts = () => {
  const dispatch = useDispatch();
  const {sellerProduct } = useSelector((state) => state.product);

  useEffect(() => {
   dispatch(fetchSellerProducts());
  }, [dispatch])
   
  return (
   <>
   {
    sellerProduct && sellerProduct.length > 0 ? (
     <SellerProductsCard sellerProduct={sellerProduct} />
    ) : (
      <p>No products found.</p>
    )
   }
   </>
  )
}

export default GetProducts