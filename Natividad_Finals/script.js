const CART_KEY = "lemonadeCart";

let cart = JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
);



function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}



function showNotification(message, type = "success") {

    const oldNotification =
        document.querySelector(".top-notification");

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification =
        document.createElement("div");

    notification.className =
        "top-notification " + type;

    notification.innerHTML = `
        <span>${message}</span>

        <button
            type="button"
            onclick="this.parentElement.remove()">
            ×
        </button>
    `;

    document.body.prepend(notification);

    setTimeout(function() {

        if (notification) {
            notification.classList.add("hide");
        }

        setTimeout(function() {

            if (notification) {
                notification.remove();
            }

        }, 300);

    }, 3000);

}



function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");



    if (cartCount) {

        let totalQuantity = 0;

        cart.forEach(function(item) {

            totalQuantity +=
                Number(item.quantity || 1);

        });

        cartCount.textContent =
            totalQuantity;

    }



    if (!cartItems || !cartTotal) {
        return;
    }


    cartItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "₱0";

        return;
    }


    let total = 0;


    

    cart.forEach(function(item, index) {

        const quantity =
            Number(item.quantity || 1);

        const price =
            Number(item.price);

        const itemTotal =
            price * quantity;

        total += itemTotal;


        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₱${price} × ${quantity}
                </p>

                <strong>
                    ₱${itemTotal}
                </strong>

            </div>


            <div class="cart-controls">

                <button
                    type="button"
                    onclick="decreaseCartQuantity(${index})">
                    −
                </button>


                <span>
                    ${quantity}
                </span>


                <button
                    type="button"
                    onclick="increaseCartQuantity(${index})">
                    +
                </button>


                <button
                    type="button"
                    onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

        `;


        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        "₱" + total;

}



function addToCart(name, price) {

    const existingItem =
        cart.find(function(item) {

            return item.name === name;

        });


    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity || 1) + 1;

    } else {

        cart.push({

            name: name,

            price: Number(price),

            quantity: 1

        });

    }


    saveCart();

    updateCart();


    showNotification(
        name + " added to cart! 🍋"
    );

}



function increaseCartQuantity(index) {

    if (!cart[index]) {
        return;
    }


    let quantity =
        Number(cart[index].quantity || 1);


    if (quantity < 99) {
        quantity++;
    }


    cart[index].quantity =
        quantity;


    saveCart();

    updateCart();

}



function decreaseCartQuantity(index) {

    if (!cart[index]) {
        return;
    }


    let quantity =
        Number(cart[index].quantity || 1);


    quantity--;


    if (quantity <= 0) {

        cart.splice(index, 1);

    } else {

        cart[index].quantity =
            quantity;

    }


    saveCart();

    updateCart();

}



function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    const itemName =
        cart[index].name;


    cart.splice(index, 1);


    saveCart();

    updateCart();


    showNotification(
        itemName + " removed from cart.",
        "info"
    );

}




function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty! 🛒",
            "error"
        );

        return;
    }


    let total = 0;

    let receiptItems = "";


    /* CREATE RECEIPT ITEMS */

    cart.forEach(function(item) {

        const quantity =
            Number(item.quantity || 1);

        const price =
            Number(item.price);

        const itemTotal =
            price * quantity;

        total += itemTotal;


        receiptItems += `

            <div class="receipt-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₱${price} × ${quantity}
                    </p>

                </div>

                <strong>
                    ₱${itemTotal}
                </strong>

            </div>

        `;

    });


    /* RECEIPT NUMBER */

    const receiptNumber =
        "LM-" + Date.now().toString().slice(-8);


    /* DATE AND TIME */

    const date =
        new Date();


    const formattedDate =
        date.toLocaleString("en-PH", {

            dateStyle: "medium",

            timeStyle: "short"

        });


    /* CREATE RECEIPT */

    const receipt =
        document.createElement("div");


    receipt.className =
        "receipt-overlay";


    receipt.innerHTML = `

        <div class="receipt-box">


            <button
                type="button"
                class="receipt-close"
                onclick="this.closest('.receipt-overlay').remove()">

                ×

            </button>


            <div class="receipt-header">


                <div class="receipt-logo">

                    Lemon<span>ade</span> 🍋

                </div>


                <h2>
                    Official Receipt
                </h2>


                <p>
                    Thank you for your order!
                </p>


            </div>


            <div class="receipt-info">


                <p>

                    <span>
                        Receipt No.
                    </span>

                    <strong>
                        ${receiptNumber}
                    </strong>

                </p>


                <p>

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formattedDate}
                    </strong>

                </p>


            </div>


            <div class="receipt-divider"></div>


            <div class="receipt-items">

                ${receiptItems}

            </div>


            <div class="receipt-total">

                <span>
                    Total
                </span>

                <strong>
                    ₱${total}
                </strong>

            </div>


            <div class="receipt-actions">


                <button
                    type="button"
                    onclick="printReceipt()"
                    class="print-receipt-btn">

                    🖨️ Print Receipt

                </button>


                <button
                    type="button"
                    onclick="this.closest('.receipt-overlay').remove()"
                    class="done-receipt-btn">

                    Done

                </button>


            </div>


            <p class="receipt-thankyou">

                Fresh lemonade made with love. 🍋

            </p>


        </div>

    `;


    document.body.appendChild(receipt);



    cart = [];

    saveCart();

    updateCart();


    showNotification(
        "Order placed successfully! 🍋"
    );

}

function printReceipt() {

    const receiptBox =
        document.querySelector(".receipt-box");


    if (!receiptBox) {
        return;
    }


    const receiptNumber =
        receiptBox.querySelector(
            ".receipt-info p strong"
        ).textContent;


    const receiptDate =
        receiptBox.querySelectorAll(
            ".receipt-info p strong"
        )[1].textContent;


    const total =
        receiptBox.querySelector(
            ".receipt-total strong"
        ).textContent;


    const items =
        Array.from(
            receiptBox.querySelectorAll(".receipt-item")
        );


    let itemsHTML = "";


    items.forEach(function(item) {

        const name =
            item.querySelector(
                "div strong"
            ).textContent;


        const details =
            item.querySelector(
                "p"
            ).textContent;


        const price =
            item.querySelectorAll(
                "strong"
            )[1].textContent;


        itemsHTML += `

            <div class="item">

                <div>

                    <strong>
                        ${name}
                    </strong>

                    <p>
                        ${details}
                    </p>

                </div>


                <strong>
                    ${price}
                </strong>

            </div>

        `;

    });


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=500,height=700"
        );


    if (!printWindow) {

        showNotification(
            "Please allow pop-ups to print the receipt.",
            "error"
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <title>
                Lemonade Shop Receipt
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    background: white;

                    color: #333;

                    padding: 30px;

                }


                .receipt {

                    max-width: 450px;

                    margin: auto;

                }


                .header {

                    text-align: center;

                    margin-bottom: 25px;

                }


                .logo {

                    font-size: 28px;

                    font-weight: bold;

                }


                .logo span {

                    color: #d99b00;

                }


                .header h2 {

                    margin:
                        10px 0 5px;

                }


                .header p {

                    color: #777;

                    margin: 0;

                }


                .info {

                    border-top:
                        1px dashed #999;

                    border-bottom:
                        1px dashed #999;

                    padding: 12px 0;

                    margin-bottom: 20px;

                }


                .info p {

                    display: flex;

                    justify-content:
                        space-between;

                    margin: 6px 0;

                    font-size: 13px;

                }


                .item {

                    display: flex;

                    justify-content:
                        space-between;

                    gap: 15px;

                    padding: 10px 0;

                    border-bottom:
                        1px solid #eee;

                }


                .item p {

                    margin:
                        4px 0 0;

                    color: #777;

                    font-size: 13px;

                }


                .total {

                    display: flex;

                    justify-content:
                        space-between;

                    border-top:
                        2px solid #333;

                    margin-top: 20px;

                    padding-top: 15px;

                    font-size: 20px;

                    font-weight: bold;

                }


                .thankyou {

                    text-align: center;

                    margin-top: 30px;

                    color: #777;

                }


            </style>

        </head>


        <body>


            <div class="receipt">


                <div class="header">

                    <div class="logo">

                        Lemon<span>ade</span> 🍋

                    </div>


                    <h2>
                        Official Receipt
                    </h2>


                    <p>
                        Thank you for your order!
                    </p>

                </div>


                <div class="info">


                    <p>

                        <span>
                            Receipt No.
                        </span>

                        <strong>
                            ${receiptNumber}
                        </strong>

                    </p>


                    <p>

                        <span>
                            Date
                        </span>

                        <strong>
                            ${receiptDate}
                        </strong>

                    </p>


                </div>


                <div>

                    ${itemsHTML}

                </div>


                <div class="total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${total}
                    </strong>

                </div>


                <p class="thankyou">

                    Fresh lemonade made with love. 🍋

                </p>


            </div>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>


        </body>

        </html>

    `);


    printWindow.document.close();

}




function sendMessage(event) {

    event.preventDefault();


    const nameElement =
        document.getElementById("name");


    if (!nameElement) {
        return;
    }


    const name =
        nameElement.value.trim();


    if (name === "") {

        showNotification(
            "Please enter your name.",
            "error"
        );

        return;

    }


    showNotification(
        "Thank you, " +
        name +
        "! Your message has been sent. 🍋"
    );


    event.target.reset();

}

updateCart();
