"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth/*path', (0, node_1.toNodeHandler)(auth_1.auth));
app.use('/api/users', user_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        data: {
            version: '1.0.0',
            endpoints: {
                auth: '/api/auth/*',
                users: '/api/users',
                categories: '/api/categories',
                products: '/api/products',
                reviews: '/api/reviews',
                orders: '/api/orders',
            },
        },
    });
});
app.use(errorHandler_1.globalErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
