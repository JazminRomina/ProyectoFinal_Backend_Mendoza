function addToCart(event) {
    event.preventDefault()
    const cartId = document.querySelector('[data-cart-id]').getAttribute('data-cart-id')
    const productId = event.target.dataset.productId
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add product to cart')
        }
        return response.json()
    })
    .then(data => {
       console.log(data)
    })
    .catch(error => {
       console.error(error)
    })
    }

const addToCartButtons = document.querySelectorAll('.btnAddToCart')
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart)
})