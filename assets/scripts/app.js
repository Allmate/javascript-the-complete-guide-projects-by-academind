class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(hookId, shouldRender = true) {
        this.renderHookId = hookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {

    }

    createRootElement(tagName, cssClasses, attributes) {
        const rootElement = document.createElement(tagName);

        if (cssClasses && cssClasses.length > 0) {
            rootElement.className = cssClasses;
        }

        if (attributes && attributes.length > 0) {
            attributes.forEach(attribute => {
                rootElement.setAttribute(attribute.name, attribute.value);
            });
        }

        document.getElementById(this.renderHookId).appendChild(rootElement);

        return rootElement;
    }
}

class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
}

class ProductItem extends Component {
    constructor(hookId, product) {
        super(hookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const productEl = this.createRootElement('li', 'product-item');
        productEl.innerHTML = `
                <div>
                    <img src="${this.product.imageUrl}" alt="${this.product.title}" />
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>\$${this.product.price}</h3>          
                        <button>Add to Cart</button>
                    </div>
                </div>
            `;
        const addToCartBtn = productEl.querySelector('button');

        addToCartBtn.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];

    constructor(hookId) {
        super(hookId);
        this.fetchProducts();
    }

    fetchProducts() {
        this.products = [
            new Product('A Good Quality Laptop', 'https://m.media-amazon.com/images/I/71nux68SjIL._AC_UY218_.jpg', 499.99, 'A Laptop for Gamer'),
            new Product('Game Controller', 'https://m.media-amazon.com/images/I/61IG46p-yHL.jpg', 20.99, 'the best game controller for player'),
            new Product('MINECRAFT', 'https://m.media-amazon.com/images/I/71TQeUM4A8L.jpg', 4.99, 'the game about placing blocks')
        ];

        this.renderProducts();
    }

    renderProducts() {
        for (const product of this.products) {
            new ProductItem('productList', product);
        }
    }

    render() {
        this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'productList')]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

class ShoppingCart extends Component {
    items = [];

    constructor(hookId) {
        super(hookId);
    }

    get totalAmount() {
        return this.items.reduce((totalAmount, product) => totalAmount + product.price, 0);
    }

    addProduct(product) {
        this.items.push(product);
        this.totalOutput.textContent = `Total \$${this.totalAmount.toFixed(2)}`
    }

    orderProduct() {
        console.log(this.items);
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total \$${0}</h2>
            <button>Order Now</button>
        `;

        this.totalOutput = cartEl.querySelector('h2');
        const orderBtn = cartEl.querySelector('button');

        orderBtn.addEventListener('click', () => this.orderProduct());
    }
}

class Shop {
    cart = new ShoppingCart('app');
    productList = new ProductList('app');
}

class App {
    // this keyword in static method refers its class(App).

    static cart; // for readability

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();