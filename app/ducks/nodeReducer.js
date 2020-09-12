export const START = 'node/START';
export const START_ERROR = 'node/START_ERROR';
export const SET_NODE_INFO = 'node/SET_NODE_INFO';
export const SET_FEE_INFO = 'node/SET_FEE_INFO';
export const SET_CUSTOM_RPC_STATUS = 'node/SET_CUSTOM_RPC_STATUS';
export const STOP = 'node/STOP';
export const START_NETWORK_CHANGE = 'node/START_NETWORK_CHANGE';
export const END_NETWORK_CHANGE = 'node/END_NETWORK_CHANGE';
export const NEW_BLOCK_STATUS = 'node/NEW_BLOCK_STATUS';
export const START_NODE_STATUS_CHANGE = 'node/START_NODE_STATUS_CHANGE';
export const END_NODE_STATUS_CHANGE = 'node/END_NODE_STATUS_CHANGE';
export const START_RPC_TEST = 'node/START_RPC_TEST';
export const END_RPC_TEST = 'node/END_RPC_TEST';

export function getInitialState() {
  return {
    error: '',
    isCustomRPCConnected: false,
    isRunning: false,
    isChangingNodeStatus: false,
    isTestingCustomRPC: false,
    isChangingNetworks: false,
    network: "main",
    apiKey: null,
    fees: {
      slow: 0,
      medium: 0,
      fast: 0
    },
    chain: {
      height: 0,
      tip: '',
    },
    newBlockStatus: ''
  };
}

export default function nodeReducer(state = getInitialState(), action = {}) {
  switch (action.type) {
    case START_NODE_STATUS_CHANGE:
      return { ...state, isChangingNodeStatus: true };
    case END_NODE_STATUS_CHANGE:
      return { ...state, isChangingNodeStatus: false };
    case START_RPC_TEST:
      return { ...state, isTestingCustomRPC: true };
    case END_RPC_TEST:
      return { ...state, isTestingCustomRPC: false };
    case START:
      return {...state, isRunning: true, network: action.payload.network, apiKey: action.payload.apiKey};
    case STOP:
      return {...state, isRunning: false, network: null};
    case START_ERROR:
      return {...state, error: action.payload.error};
    case SET_NODE_INFO:
      return {
        ...state,
        chain: action.payload.info.chain,
      };
    case SET_CUSTOM_RPC_STATUS:
      return {
        ...state,
        isCustomRPCConnected: action.payload,
      };
    case SET_FEE_INFO:
      return {
        ...state,
        fees: action.payload.fees,
      };
    case START_NETWORK_CHANGE:
    case END_NETWORK_CHANGE:
      return {
        ...state,
        isChangingNetworks: action.type === START_NETWORK_CHANGE
      };
    case NEW_BLOCK_STATUS:
      return {
        ...state,
        newBlockStatus: action.payload,
      };
    default:
      return state;
  }
}
