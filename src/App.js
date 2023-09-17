import {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import IconButton from '@mui/material/IconButton';
import ProductModal from "./blocks/modals/productModal";
import SearchIcon from '@mui/icons-material/Search';
import 'swiper/css';
import 'swiper/css/navigation';
import {connect} from "react-redux";
import {getAllCart, messageReset} from "./store/cart";
import {getFilteredProducts, getProductNextPage, getProducts, getProductTitleFilter} from "./store/Products";
import {getCategories} from "./store/Categories";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from 'react-infinite-scroll-component';
import CartModal from "./blocks/modals/cartModal";
import {InputAdornment, TextField} from "@mui/material";
import {toast} from "react-toastify";
SwiperCore.use([Navigation]);


const tg = window.Telegram.WebApp

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function App(props) {
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setProductLoading] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const [modal, setModal] = useState(false)
    const [cart, setCart] = useState([])
    const [allSumCart, setAllSumCart] = useState(0)
    const [openItem, setOpenItem] = useState(false)
    const [cartModal, setCartModal] = useState(false)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [searchWord, setSearchWord] = useState(false)
    const [categoryId, setCategoryId] = useState(false)

    function windowTop(val) {
        const searchElement = document.querySelectorAll('.search-box')[0]
        const offsetTopElement = searchElement.offsetTop
        window.scrollTo(0, offsetTopElement - 10)
    }

    function orderProduct(item) {
        setModal(true)
        setOpenItem(item)
    }

    function getCategoryProducts(e, item) {
        if(categoryId == item.id){
            props.getProducts()
            setCategoryId(false)
        }else{
            props.getFilteredProducts(item.id)
            setCategoryId(item.id)
        }
        loadingDataProduct()
    }

    function Filtering(event) {
        event.preventDefault()
        setSearchWord(event.target.value)
        props.getProductTitleFilter(event.target.value)
    }

    useEffect(() => {
        loadingData()
        tg.ready()
        console.log(tg.initDataUnsafe, 123123)
        props.getAllCart()
        props.getProducts()
        props.getCategories()
    }, [])

    useEffect(() => {
        const myCart = props.cart.cart
        if (myCart && myCart.length > 0) {
            let sum = 0;
            for (let i = 0; i < myCart.length; i++) {
                sum += myCart[i].product.price * Number(myCart[i].quantity);
            }
            setAllSumCart(sum)
        } else {
            setAllSumCart(0)
        }
        setCart(myCart)
    }, [props])

    useEffect(() => {
        const myProducts = props.product.products
        setProducts(myProducts['results'])
    }, [props.product.products])


    useEffect(() => {
        const myCategories = props.categories.categories
        setCategories(myCategories)
    }, [props.categories])


    function getNextPage() {
        const page = props.product.products.next
        const newpage = page.split("products/?").pop()
        props.getProductNextPage(newpage)
    }

    function openCart() {
        if(cart.length){
            setCartModal(!cartModal)
        }else{
            toast.info('Корзина пуста!', {
                position: "top-center",
                autoClose: 2000,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    function loadingDataProduct() {
        setProductLoading(true);
        setTimeout(() => {
            setProductLoading(false);
        }, 700);
    }

    function loadingData() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }


    return (
        <main>
            <ProductModal isOpen={modal} orderItem={openItem} setIsOpen={() => setModal()}/>
            <CartModal allSumCart={allSumCart} isOpen={cartModal} setCartApp={() => setCart()} setIsOpen={() => setCartModal()}/>
            <div className="categories">
                {categories.length > 8 ?
                    <div className={'double-categories'}>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={3}
                            navigation={true}
                        >
                            {categories ? categories.filter((item, index) => index % 2 === 0).map((item, index) =>
                                <SwiperSlide className={'category-card'} key={index}
                                             onClick={() => getCategoryProducts(item)}>
                                    <div className={'category-block'}>
                                        {loading ? <Skeleton count={1} height={80}/>
                                            : <img src={item.photo} alt={item.title}/>}
                                        <h5 className={'category-title'}>{item.title}</h5>
                                    </div>
                                </SwiperSlide>
                            ) : <Skeleton count={2}/>}
                        </Swiper>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={3}
                            navigation={true}
                        >
                            {categories ? categories.filter((item, index) => index % 2 === 1).map((item, index) =>
                                <SwiperSlide className={'category-card'} key={index}
                                             onClick={(e) => getCategoryProducts(e, item)}>
                                    <div className={'category-block'}>
                                        {loading ? <Skeleton count={1} height={80}/>
                                            : <img src={item.photo} alt={item.title}/>}
                                        <h5 className={'category-title'}>{item.title}</h5>
                                    </div>
                                </SwiperSlide>
                            ) : <Skeleton count={2}/>}
                        </Swiper>
                    </div>
                    :
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={3}
                        navigation={true}
                    >
                        {categories ? categories.map((item, index) =>
                            <SwiperSlide className={item.id==categoryId ? 'active category-card' : 'category-card'} key={index}
                                         onClick={(e) => getCategoryProducts(e, item)}>
                                <div className={'category-block'}>
                                    {loading ? <Skeleton count={1} height={80}/>
                                        : <img src={item.photo} alt={item.title}/>}
                                    <h5 className={'category-title'}>{item.title}</h5>
                                </div>
                            </SwiperSlide>
                        ) : ''}
                    </Swiper>
                }
            </div>
            <div className={'search-box filter-product'}>
                <form id={'filter'}>
                    <label className={'search-label'}>
                        <TextField id="input-with-icon-textfield" onFocus={windowTop} onChange={Filtering}
                                   name={'search'}
                                   className={'search-input'} label="Излаш" type="search"
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment className={!searchWord ? '' : 'd-none'} position="end">
                                               <SearchIcon/>
                                           </InputAdornment>
                                       )
                                   }}/>
                    </label>
                </form>
            </div>
            {loadingProduct ?
                <div className={'products'}>
                    <div className={'p-2'}><Skeleton count={5} style={{'height': '100px', 'margin': '8px 0'}}/></div>
                </div>
                :
                <div className={'products'}>
                    <InfiniteScroll
                        dataLength={products ? products.length : 1}
                        next={getNextPage}
                        hasMore={props.product.products.next ? true : false} // Replace with a condition based on your data source
                        loader={<div className={'p-2'}><Skeleton count={5}
                                                                 style={{'height': '100px', 'margin': '8px 0'}}/></div>}
                        endMessage={''}>
                        {products ? products.map(item =>
                            <div className="product" key={item.id} onClick={() => orderProduct(item)}>
                                <div className="product-card">
                                    <div className={'product-body'}>
                                        <h5 className="title">
                                            {item.title}
                                        </h5>
                                        <p className={'description'}>
                                            {item.description}
                                        </p>
                                        <div className={'price-block'}>
                                            <h6>{item.price} сум</h6>
                                        </div>
                                    </div>
                                    <div className={'product-img'}>
                                        <img src={item.photo} width={140} height={140} alt={item.title}/>
                                    </div>
                                </div>
                                <div className="addToCart">
                                    <IconButton color="default" aria-label="add to shopping cart">
                                        Заказать
                                        {/*<AddShoppingCartIcon />*/}
                                    </IconButton>
                                </div>
                            </div>
                        ) : <div className={'p-2'}><Skeleton count={5} style={{'height': '130px', 'margin': '8px 0'}}/>
                        </div>}
                    </InfiniteScroll>
                </div>}
            <div className={'cart-button'} onClick={openCart}>
                <span>Корзина {nextPage}</span>
                <span><b>{numberWithSpaces(allSumCart)} сум</b></span>
            </div>
        </main>
    )
}

export default connect(props => props, {
    getAllCart, getProducts, getFilteredProducts,
    getCategories, getProductNextPage, getProductTitleFilter, messageReset
})(App)