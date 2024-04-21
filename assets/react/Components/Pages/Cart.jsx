import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../Partials/Header';
import Footer from "../Partials/Footer";

import { BsFillTrash3Fill } from 'react-icons/bs';


function Cart({itemsInCart, totalPrice, setQntity, deleteItem}) {



    // Set Page Title
    document.title = 'Shop - Cart';
    return (
        <>
            <Header itemsCount = {itemsInCart?.length} />

            <div className="container">
                
                <div className="shopping-cart">
                    <h1 className='sh-c-heading'>Shopping Cart</h1>

                    { itemsInCart?.length
                    ?
                    <>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th className='table-qnty'>Quntity</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    itemsInCart && itemsInCart?.map((product, i) => (
                                        <tr key={product.id}>
                                            <td>{product.title}</td>
                                            <td>{product.price}$</td>
                                            <td className='table-qnty'>
                                                <span onClick={()=>setQntity(product.id, 'decrease', product.price, i)}>-</span>
                                                <strong>{product.itemQntity}</strong>
                                                <span onClick={()=>setQntity(product.id, 'increase', product.price, i)}>+</span>
                                            </td>
                                            <td className='table-trash'>
                                                <strong className='delete-item' onClick={()=>{deleteItem(product.id)}}><BsFillTrash3Fill /></strong>
                                            </td>
                                        </tr>
                                    ))
                                }
                            
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Toltat</td>
                                    <td colSpan='3'>{totalPrice}$</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="proceed-checkout">
                            <Link to='/checkout' className='button'>Proceed to checkout</Link>
                        </div>
                    </>
                    : 
                    <div className='no-items-selected'>
                        <p> You did not add products to your shopping cart! </p>
                        <p> <Link to='/'>Click here!</Link> to browse our products.</p>
                    </div>



                    }

                </div>

            </div>

            <Footer />
        </>
    )
}


export default Cart;