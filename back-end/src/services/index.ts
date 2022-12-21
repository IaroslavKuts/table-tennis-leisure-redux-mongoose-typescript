import mailService from "./mail_service";
import payPalservice from "./paypal_service";
const services = { ...mailService, ...payPalservice };
export default services;
