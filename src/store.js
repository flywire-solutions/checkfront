import Vue from "vue";
import Vuex from "vuex";

import dataService from "./api/dataService";
import utils from "./utils";

Vue.use(Vuex);

const initialState = {
  ui: {
    isLoading: false,
    configErrors: [],
    paymentErrors: [],
  },
  portal: {
  },
  paymentConfig: {},
  result: { },
};

const getters = {
  formattedAmount: (state) => {
    return utils.formatAmount(
      state.paymentConfig.amount,
      state.portal.currency
    );
  },
  client: (state) => {
    return {
      name: state.portal.name,
      logo: state.portal.logo_url,
    };
  },
  booking: (state) => {
    if (state.paymentConfig.recipientFields) {
      return state.paymentConfig.recipientFields.booking_reference;
    }
    return '';
  },
  canPay: (state) => {
    return (
      !state.ui.isLoading && 
      state.ui.configErrors.length === 0 &&
      state.paymentConfig.amount > 0
    );
  },
  isError: (state) => {
    return (
      !state.ui.isLoading &&
      state.result.status !== "success" &&
      state.result.status !== "pending"
    );
  },
};

const mutations = {
  UI_START_LOADING(state) {
    state.ui.isLoading = true;
  },
  UI_STOP_LOADING(state) {
    state.ui.isLoading = false;
  },
  UI_ADD_CONFIG_ERROR(state, payload) {
    state.ui.configErrors.push(payload.error);
  },
  UI_ADD_PAYMENT_ERRORS(state, payload) {
    state.ui.paymentErrors = payload.errors;
  },
  UI_CLEAR_ERRORS(state) {
    state.ui.configErrors = [];
    state.ui.paymentErrors = [];
  },
  PAYMENT_CONFIG_INIT(state, payload) {
    state.paymentConfig = payload;
  },
  PORTAL_INIT(state, payload) {
    state.portal = payload;
  },
  RESULT_INIT(state, payload) {
    state.result = payload;
  },
};

const actions = {
  load: ({ commit }) => {
    commit("UI_START_LOADING");
    let { client, booking, env = "prod" } = utils.getQueryStringValues();

    dataService
      .getPaymentConfig(client, booking, env)
      .then((paymentConfig) => {
        commit("PAYMENT_CONFIG_INIT", paymentConfig);

        dataService
          .getPortalInfo(paymentConfig.recipientCode, env)
          .then((portalInfo) => {
            commit("PORTAL_INIT", portalInfo);
            commit("UI_STOP_LOADING");
        });
    });
  },
  paymentSetErrors: ({ commit }, value) => {
    commit("UI_ADD_PAYMENT_ERRORS", {
      errors: value,
    });
  },
  pay: ({ commit }) => {
    commit("UI_CLEAR_ERRORS");
  },
  complete: ({ commit }, value) => {
    let { reference, status, payment_method: paymentMethod } = value;

    commit("RESULT_INIT", {
      status,
      reference,
      paymentMethod,
    });
  },
};

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  strict: debug,
  state: initialState,
  getters,
  mutations,
  actions,
});

export default store;
