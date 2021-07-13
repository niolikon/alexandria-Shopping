require('dotenv').config();

module.exports = {
    taxes: process.env.REACT_APP_TAXES,
    authenticationLogin: process.env.REACT_APP_AUTH_LOGIN,
    authenticationCheckJWT: process.env.REACT_APP_AUTH_CHECKJWT,
    httpTimeoutMs: process.env.REACT_APP_HTTP_TIMEOUT_MS,

    inventoryService: process.env.REACT_APP_SERVICE_INVENTORY,
    purchasingService: process.env.REACT_APP_SERVICE_PURCHASING,
}