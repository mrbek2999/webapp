import {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@mui/icons-material/Close';
import {connect} from "react-redux";
import {cartSave, getAllCart, messageReset} from "../../store/cart";
import {toast, ToastContainer} from "react-toastify";


function ProductModal(props) {
    const [show, setShow] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (props.message == 'deleted') {
            toast.success('Товар удален из корзины!', {theme: 'colored', draggable: false, autoClose: 1600, delay: 10})
            props.messageReset()
        } else if (props.message === 'error') {
            toast.error('Ошибка! Пожалуйста, обновите страницу!', {theme: 'colored', draggable: false, autoClose: 1600})
            props.messageReset()
        } else if (props.message === true) {
            toast.success('Товары добавлены в корзину', {theme: 'colored', draggable: false, autoClose: 1600, delay: 10})
            props.messageReset()
            props.getAllCart()
            props.setIsOpen(false)
        } else if (props.message === 'edited') {
            props.messageReset()
        }
    }, [props.message])

    useEffect(() => {
        setQuantity(1)
    }, [props])

    function addToCart(item) {
        let data = {};
        data.buyer = 11
        data.quantity = quantity
        data.product = item.id
        props.cartSave(data)
    }

    function AddQuantity() {
        setQuantity(quantity + 1)
    }

    function RemoveQuantity() {
        setQuantity(quantity - 1)
    }

    function handleClose() {
        setShow(false);
        props.setIsOpen(false);
    }

    useEffect(() => {
        setShow(props.isOpen)
    }, [props.isOpen])

    return (
        <div>
            <ToastContainer/>
            {props.orderItem ?
                <Modal show={show} onHide={handleClose} className={'product-order mt-3'}
                       aria-labelledby="contained-modal-title-vcenter">
                    <img src={props.orderItem.photo} width={100} height={220} alt={props.orderItem.title}/>
                    <h3>{props.orderItem.title}</h3>
                    <p>{props.orderItem.description}</p>
                    <div className={'addToCartBlock'}>
                        <h4 className={'price-product'}>{quantity * props.orderItem.price} сум</h4>
                        <div className={'counter'}>
                            <p>Количество</p>
                            <button onClick={RemoveQuantity} disabled={quantity === 1 ? true : false}
                                    className={`quantityBtn`}>-
                            </button>
                            <span className={'quantity'}>{quantity}</span>
                            <button onClick={AddQuantity} className={'quantityBtn'}>+</button>
                        </div>
                        <button className={'addToCartBtn'}
                                onClick={() => addToCart(props.orderItem)}>Добавить в корзину
                        </button>
                    </div>
                    <Button variant="contained" className={'close-btn'}
                            onClick={handleClose}><CloseIcon/></Button>
                </Modal> : ''}

        </div>
    )
}

export default connect(props => props.cart, {cartSave, messageReset, getAllCart})(ProductModal)