// A function that given a dawa response gets data from the backend
import * as Sentry from "@sentry/browser";
import trackEvent from "./action-logger.js";
import axios from "axios";
export default function getKomKode(bbr_id, callback) {
  let houseData = { failed: true };
  console.log("BBR: " + bbr_id);
  axios
    .get(
      "https://api.dataforsyningen.dk/bbrlight/enheder?adresseid=" +
        bbr_id
    )
    .then(resp => {
      houseData = resp.data[0].bygning.KomKode;
      trackEvent({
        description: "Adresse indtastet. Kommune fundet."
      });
    })
    .catch(err => console.log(Sentry.captureException(err)))
    .then(() => callback(houseData));
}
