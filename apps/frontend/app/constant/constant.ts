// helper to generate A, B, C...
import { generateLabels } from "../utils/page";

// common steps
const COMMON_STEPS = [
   {
    key: "CLIENT",
    label: "Client",
    instruction: "Dispatching request payload...",
  },
  {
    key: "API",
    label: "API Gateway",
    instruction: "Routing incoming request...",
  },
];

// PRODUCT
export const PLACE_ORDER_STEPS = [
  ...COMMON_STEPS,
  {
    key: "ORDER_SERVICE",
    label: "Order Service",
    instruction: "Processing order request...",
  },
  {
    key: "EVENT_PUBLISHED",
    label: "Event Published",
    instruction: "Publishing RabbitMQ event...",
  },
  {
    key: "STATE_UPDATED",
    label: "State Updated",
    instruction: "Syncing cart inventory...",
  },
];

export const PLACE_ORDER_LABELS = generateLabels(PLACE_ORDER_STEPS.length);

// CART
export const CART_STEPS = [
  ...COMMON_STEPS,
 {
    key: "CART_SERVICE_RECEIVED",
    label: "Cart Service",
    instruction: "Receiving update request...",
  },
  {
    key: "ITEMS_ADDED",
    label: "Items Added",
    instruction: "Updating database records...",
  },
  {
    key: "CART_UPDATED",
    label: "Cart Updated",
    instruction:
      "Cart service confirms the cart has been updated and is ready for checkout.",
  }
];

export const CART_LABELS = generateLabels(CART_STEPS.length);

// LOGIN
export const LOGIN_STEPS = [
  ...COMMON_STEPS,
   {
    key: "AUTH_SERVICE_HIT",
    label: "Auth Service",
    instruction: "Contacting authentication service...",
  },
  {
    key: "USER_VALIDATION",
    label: "User Validation",
    instruction: "Verifying user credentials...",
  },
  {
    key: "TOKEN_ISSUED",
    label: "Token Issued",
    instruction: "Generating authentication token...",
  },
  {
    key: "SESSION_ACTIVE",
    label: "Session Active",
    instruction: "Activating user session...",
  }
];

export const LOGIN_FLOW_LABELS = generateLabels(LOGIN_STEPS.length);

// SIGNUP
export const SIGNUP_STEPS = [
  ...COMMON_STEPS,
  {
    key: "AUTH_SERVICE_HIT",
    label: "Auth Service",
    instruction: "Validating access credentials...",
  },
  {
    key: "PASSWORTD_ENCRYPTION",
    label: "Password Encryption",
    instruction: "Hashing user password...",
  },
  {
    key: "USER_CREATED",
    label: "User Created",
    instruction: "Saving user data...",
  },
  {
    key: "READY_FOR_LOGIN",
    label: "Login Ready",
    instruction: "Finalizing user access...",
  }
];

export const SIGNUP_FLOW_LABELS = generateLabels(SIGNUP_STEPS.length);