document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const loginForm = document.querySelector('.login-form');
    const navbar = document.querySelector('.navbar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartTableBody = document.querySelector('#cart-table tbody');
    const proceedToPayButton = document.querySelector('#proceed-to-pay');
    const buttons = document.querySelectorAll('.button-container button');

    // Search button functionality
    document.querySelector('#search-btn').onclick = () =>{
        searchForm.classList.toggle('active');
        loginForm.classList.remove('active');
        navbar.classList.remove('active');
    }

    // Login button functionality
    document.querySelector('#login-btn').onclick = () =>{
        loginForm.classList.toggle('active');
        searchForm.classList.remove('active');
        navbar.classList.remove('active');
    }

    // Menu button functionality
    document.querySelector('#menu-btn').onclick = () =>{
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        loginForm.classList.remove('active');
    }

    // Remove active classes on scroll
    window.onscroll = () =>{
        searchForm.classList.remove('active');
        loginForm.classList.remove('active');
        navbar.classList.remove('active');
    }

    // Function to save cart data to localStorage
    function saveCartToLocalStorage() {
        const cartData = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const productName = row.cells[0].innerText;
            const productPrice = row.cells[1].innerText;
            const productQuantity = row.cells[2].innerText;
            const productTotal = row.cells[3].innerText;
            cartData.push({ productName, productPrice, productQuantity, productTotal });
        });
        localStorage.setItem('cartData', JSON.stringify(cartData));
    }

    // Function to load cart data from localStorage
    function loadCartFromLocalStorage() {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
        cartData.forEach(item => {
            const newRow = cartTableBody.insertRow();
            newRow.insertCell(0).innerText = item.productName;
            newRow.insertCell(1).innerText = item.productPrice;
            newRow.insertCell(2).innerText = item.productQuantity;
            newRow.insertCell(3).innerText = item.productTotal;

            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', function() {
                newRow.remove();
                saveCartToLocalStorage();
            });
            newRow.insertCell(4).appendChild(removeButton);
        });
    }

    // Call the loadCartFromLocalStorage function when the page loads
    loadCartFromLocalStorage();

    // Add to Cart Button Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('.product-text h2').innerText;
            const productPrice = parseFloat(card.querySelector('.price').innerText.replace('LKR', ''));
            const quantityInput = card.querySelector('.quantity input');
            const productQuantity = parseFloat(quantityInput.value);

            if (isNaN(productQuantity) || productQuantity <= 0) {
                alert('Please enter a valid quantity');
                return;
            }

            const existingRow = Array.from(cartTableBody.rows).find(row => row.cells[0].innerText === productName);

            if (existingRow) {
                const existingQuantity = parseFloat(existingRow.cells[2].innerText);
                const newQuantity = existingQuantity + productQuantity;
                const newTotal = productPrice * newQuantity;

                existingRow.cells[2].innerText = newQuantity;
                existingRow.cells[3].innerText = newTotal.toFixed(2) + ' LKR';
            } else {
                const newRow = cartTableBody.insertRow();
                newRow.insertCell(0).innerText = productName;
                newRow.insertCell(1).innerText = productPrice.toFixed(2) + ' LKR';
                newRow.insertCell(2).innerText = productQuantity;
                newRow.insertCell(3).innerText = (productPrice * productQuantity).toFixed(2) + ' LKR';

                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', function() {
                    newRow.remove();
                    saveCartToLocalStorage();
                });
                newRow.insertCell(4).appendChild(removeButton);
            }

            quantityInput.value = ''; // Clear input field
            saveCartToLocalStorage();
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    proceedToPayButton.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = './order.html';  // Redirect to order page
    });
});
