<template>
    <div class="checkout">
        <div class="card text-center">
            <div class="card-header">
                <img src="@/assets/flywire.png" height="20px"/>
            </div>
            <div class="card-body">
                <img v-if="client.logo" :src="client.logo" :alt="client.name" />
                <div v-if="formattedAmount" class="payment-info">
                    <h3>
                      <small>Balance Due</small>
                      {{ formattedAmount }}
                    </h3>
                </div>
                <div v-if="ui.configErrors.length > 0 || ui.paymentErrors.length > 0" class="errors">
                    <template v-for="e in ui.configErrors">
                        <span :key="e">{{ e }}</span>
                    </template>
                    <template v-for="e in ui.paymentErrors">
                        <span :key="e.id">{{ e.msg }}</span>
                    </template>
                </div>
                <ul v-if="paymentConfig" class="list-group list-group-flush">
                    <li class="list-group-item">
                        <dl>
                            <dt>Booking Reference</dt>
                            <dd>{{ booking }}</dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <div class="card-footer">
                <button :disabled="!canPay" class="btn btn-primary" v-on:click="onPay">Make Payment</button>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex'

export default {
    name: 'checkout',
    computed: {
        ...mapState({
          ui: 'ui',
          portal: 'portal',
          paymentConfig: 'paymentConfig'
        }),
        ...mapGetters([
          'formattedAmount',
          'client',
          'booking',
          'canPay'
       ])
    },
    mounted: function() {
      this.$store.dispatch('load');
    },
    methods: {
      onPay: function() {
        var that = this;
        var popup = null;

        this.$store.dispatch('pay')

        var config = Object.assign({}, this.paymentConfig);
        config.requestPayerInfo = true,
        config.onInvalidInput = (errs) => {
          that.$store.dispatch('paymentSetErrors', errs)
        },
        config.onCompleteCallback = (args) => {
          // eslint-disable-next-line no-console
          console.log(args);
          that.$store.dispatch('complete', args);
          that.$router.push('complete');
        }

        popup = window.FlywirePayment.initiate(config);
        popup.render();
      }
    }
}
</script>

<style lang="scss">
    .checkout {
        width: 400px;
        margin: 50px auto;

        .card-body {
            padding-bottom: 0;
        }
    }
    h4, h3 {
        small {
            display: block;
            font-size: 1rem;
        }
    }
    .payment-info, .form-group { 
        margin-top: 8px;
    }
    

    .payment-info{ 
        background-color: #1274C4;
        color: white;
        margin: 0 -20px;
        padding: 5px 0;
    }

    .errors {
        background-color: #D3556B;
        color: white;
        margin: 5px -20px;
        padding: 5px 0;

        span {
            display: block;
        }
    }

    
</style>

