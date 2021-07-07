import React from 'react';

import * as Sentry from "@sentry/browser";
import trackEvent from "../components/action-logger";
import axios from "axios";

import kodeliste from "../data/bbr-kodeliste.json";


export default class BBRModule extends React.Component {
    state = {
        externalData: null,
        isLoaded: false
    };

    static getDerivedStateFromProps(props, state) {
        if (props.bbr_id !== state.bbr_id) {
            return {
                externalData: null,
                isLoaded: false
            };
        }
        // No state update necessary
        return null;
    }
  
    componentDidMount() {
        this._loadAsyncData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.externalData === null) {
            this._loadAsyncData();
        }
    }

    componentWillUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }

    _loadAsyncData() {
        let bbr_data = {failed : true}
        axios.get(
            "https://api.dataforsyningen.dk/bbrlight/enheder?adresseid=" +
                this.props.bbr_id
        )
        .then(resp => {
            console.log(resp)
            if(resp.data.length > 0){
                bbr_data = resp.data[0]
                this.setState({ 
                    isLoaded: true, 
                    data: bbr_data,  
                    externalData: "",
                    bbr_id : this.props.bbr_id
                })
            } else {
                this.setState({
                    isLoaded: false,
                    externalData: "",
                    bbr_id : this.props.bbr_id
                })
            }
            trackEvent({
                description: "BBR-data fundet."
            });
        })
        .catch(err => console.log(Sentry.captureException(err)))
    };

    render() {
        const data = this.state.data;
        
        console.log("UPDATE")
        return (
            <>
            {!this.state.isLoaded ?
                <div>
                    <p>Kunne ikke indlæse BBR-oplysninger for denne addresse.</p>
                    <p>Fejlen kan skyldes lejligheder på addressen. Vælg etage og prøv igen.</p>
                </div> 
                :
                <div>
                    <h2>{this.props.address}</h2>
                    <h3>Bygningsoplysninger</h3>
                    <hr />
                    <p>Opførelsesår: {data.bygning.OPFOERELSE_AAR}</p>
                    <p>Seneste om- eller tilbygningsår:: {data.bygning.OMBYG_AAR}</p>
                    Materialer
                    <p>Ydervægsmateriale:  {kodeliste.YDERVAEG_KODE[data.bygning.YDERVAEG_KODE]}</p>
                    <p>Tagdækningsmateriale:  {kodeliste.TAG_KODE[data.bygning.TAG_KODE]}</p>
                    <h3>Varme og energi</h3>
                    <p>Bygningens varmeinstallation:  {kodeliste.VARMEINSTAL_KODE[data.bygning.VARMEINSTAL_KODE]}</p>
                    <p>Bygningens opvarmningsmiddel:  {kodeliste.OPVARMNING_KODE[data.bygning.OPVARMNING_KODE]}</p>
                    <p>Bygningens supplerende varmeinstallation:  {kodeliste.VARME_SUPPL_KODE[data.bygning.VARME_SUPPL_KODE]}</p>
                    <h3>Anvendelse</h3>
                    <h4>Fordeling af anvendelse i m2</h4>
                    <p>Bygningens anvendelse:  {kodeliste.ENH_ANVEND_KODE[data.ENH_ANVEND_KODE]}</p>
                    <p>Bygningens samlede boligareal:  {data.bygning.BYG_BOLIG_ARL_SAML} m2</p>
                    <p>Enhedens anvendelse:  {kodeliste.ENH_ANVEND_KODE[data.ENH_ANVEND_KODE]}</p>
                    <p>Enhedens samlede areal:  {data.BEBO_ARL}</p>
                    <p>Antal værelser i alt:  {data.VAERELSE_ANT}</p>
                    <p>Toiletforhold:  {kodeliste.TOILET_KODE[data.TOILET_KODE]}</p>
                    <p>Antal toiletter:  {data.AntVandskylToilleter}</p>
                    <p>Badeforhold:  {kodeliste.BAD_KODE[data.BAD_KODE]}</p>
                    <p>Antal badeværelser:  {data.AntBadevaerelser}</p>
                    <p>Køkkenforhold: {kodeliste.koekkenforhold[data.KOEKKEN_KODE]}</p>
                    
                </div>
            }
            </>
        );
    }
}  


