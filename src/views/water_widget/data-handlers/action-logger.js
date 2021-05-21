async function trackEvent(action) {
  var dataLayer = (window.dataLayer = window.dataLayer || []);
  const log = {
    event: "klimaCheck",
    eventCategory: "Water comes APP",
    eventAction: action.description,
    eventLabel: action.eventLabel,
    cloudbirstDimension: action.cloudbirstDimension,
    floodDimension: action.floodDimension
  };

  dataLayer.push(log);
  console.log(log);
}

export default trackEvent;
