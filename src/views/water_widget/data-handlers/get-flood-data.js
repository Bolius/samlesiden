// A function that given a dawa response gets data from the backend
import * as Sentry from "@sentry/browser";
import trackEvent from "./action-logger.js";
import axios from "axios";
export default function getFloodData(bbr_id, callback) {
  let houseData = { failed: true };
  console.log(bbr_id);
  axios
    .get(
      "https://exl9ly9iwa.execute-api.eu-central-1.amazonaws.com/Prod/flood-risk?unadr_bbrid=" +
        bbr_id
    )
    .then(resp => {
      const data = resp.data;
      console.log(data);
      houseData = data;
      houseData.text = data.navn;
      trackEvent({
        description: "Adresse indtastet",
        // Gets 2300 københavn part of adrress
        eventLabel: houseData.navn
          .split(", ")
          .slice(-1)
          .pop(),
        cloudbirstDimension: houseData.rain_risk.risk,
        floodDimension: houseData.storm_flood.risk
      });
    })
    .catch(err => console.log(Sentry.captureException(err)))
    .then(() => callback(houseData));
  
}
