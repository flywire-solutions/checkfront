
export default {
  getPaymentConfig(clientName, bookingId, env) {
    return fetch(`https://flywire-checkfront.azurewebsites.net/api/bookings/${clientName}/${bookingId}?env=${env}`)
      .then(response => {
        return response.json();
      })
  },
  getPortalInfo(portalCode, env) {
    return fetch(`https://payment.${env == 'demo' ? 'demo.' : ''}flywire.com/v3/recipients/${portalCode}`)
      .then(response => {
        return response.json();
      })
  }
}