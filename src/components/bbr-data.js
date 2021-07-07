// A function that given a dawa response gets data from the backend
import * as Sentry from "@sentry/browser";
import trackEvent from "./action-logger.js";
import axios from "axios";
export default function getBBRData(bbr_id, callback) {
  let bbr_data = { failed: true };
  console.log("BBR: " + bbr_id);
  axios
    .get(
      "https://api.dataforsyningen.dk/bbrlight/enheder?adresseid=" +
        bbr_id
    )
    .then(resp => {
      bbr_data = resp.data[0];
      trackEvent({
        description: "BBR-data fundet."
      });
    })
    .catch(err => console.log(Sentry.captureException(err)))
    .then(() => callback(bbr_data));
}
