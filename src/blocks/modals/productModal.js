import {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@mui/icons-material/Close';


function ProductModal(props) {
    const [show, setShow] = useState(false);
    const [quantity, setQuantity] = useState(1);


    function AddQuantity(){
        setQuantity(quantity+1)
    }
    function RemoveQuantity(){
        setQuantity(quantity-1)
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
            {props.item ?
                <Modal show={show} onHide={handleClose} className={'product-order mt-3'} aria-labelledby="contained-modal-title-vcenter">
                    <img src={props.item.photo} width={100} height={220} alt={props.item.title} />
                    <h3>{props.item.title}</h3>
                    <p>{props.item.description}</p>
                    <div className={'addToCartBlock'}>
                        <h4 className={'price-product'}>{quantity*props.item.price} сум</h4>
                        <div className={'counter'}>
                            <p>Количество</p>
                            <button onClick={RemoveQuantity} disabled={quantity===1 ? true : false} className={`quantityBtn`}>-</button>
                            <span className={'quantity'}>{quantity}</span>
                            <button onClick={AddQuantity} className={'quantityBtn'} >+</button>
                        </div>
                        <button className={'addToCartBtn'}>Добавить в корзину</button>
                    </div>
                    <Button variant="contained"  className={'close-btn'} onClick={handleClose}><CloseIcon/></Button>
                </Modal>
                :
                <div>Loading...</div>}
        </div>
    );
}

export default ProductModal;