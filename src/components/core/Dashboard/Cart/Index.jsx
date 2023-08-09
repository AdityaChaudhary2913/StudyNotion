import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderCartPrice from './RenderCartPrice';

const Cart = () => {
  const {total, totalItems} = useSelector((state) => state.cart);
  return (
    <div className='text-white'>
      <h1>Your Cart</h1>
      <p>{totalItems} Courses in Your Cart</p>
      {
        totalItems > 0 ? (<div>
          <RenderCartCourses />
          <RenderCartPrice />
        </div>) : (<p className='flex justify-center items-center mt-20 text-5xl'>Your Cart Is Empty!</p>)
      }
    </div>
  )
}

export default Cart