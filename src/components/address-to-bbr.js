// A function that given a dawa response gets data from the backend
import * as Sentry from "@sentry/browser";
import axios from "axios";
export default function getBBRid(address) {
    let data = { };
    axios
        .get(
            "https://api.dataforsyningen.dk/adresser?q=" +
            address
        )
        .then(resp => {
            data = resp.id;
            console.log(data);
        })
        .catch(err => console.log(Sentry.captureException(err)))
    return data;
}
