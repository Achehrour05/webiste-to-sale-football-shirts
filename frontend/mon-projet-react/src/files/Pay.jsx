import React from 'react'
import './Pay.css'
import Input  from './Input.jsx';
import Form  from './Button.jsx';
import Email  from './Email.jsx';
import  Button  from './Button.jsx';
import { useLocation } from "react-router-dom";
import ProductCard from './ProductCard.jsx';

function Pay() {

  const location = useLocation();

  const productImage = location.state?.img || "";
  const productText = location.state?.text || "Produit Inconnu";
  const productPrice = location.state?.price || "Prix non disponible";

  return (
    <div className='PayContainer'>
      <div className='leftt'>
        <p className='middle'>Express checkout</p>
        <button className='pp'>
          <img  src={require("../assets/pp.png")} alt="CMI" />
          <p >PayPal Express Checkout</p>
        </button>
        <p className='middle'>Or</p>
        <h6>Delivery country</h6>
        <Input/>
        <h6>Email address</h6>
        <Email width={490} label="Email Address"/>
        <h6>Shipping address</h6>
        <Email width={490} label="Your Address"/>
        <div className='frm2'>
        <Email width={230} label="First Name" />
        <Email width={230} label="Lasr Name"/>
        </div>
        <Email width={490} label="Mobile"/>
        <Email width={490} label="Post Code"/>
        <div className='paybutt'>
        <Button/>
        </div>
        
      </div>
      <div className='rightt'>
        <ProductCard img={productImage} text={productText} price={productPrice} />
      </div>
    </div>
  )
} export default Pay
