import React from 'react';

import KommuneIndbrud from './KommuneIndbrud'
import Grundskyld from './KommuneGrundskyld'
import KommuneBoligpriser from './KommuneBoligpriser'

function IndbrudIncluder(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="warning">
      <KommuneIndbrud id={props.id} />
    </div>
  );
}

function GrundskyldIncluder(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="warning">
      <Grundskyld id={props.id} />
    </div>
  );
}

function BoligpriserIncluder(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="warning">
      <KommuneBoligpriser id={props.id} />
    </div>
  );
}


class KommuneSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '101',
      showIndbrud: false,
      showGrundskyld: false,
      showBoligpriser: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState(state => ({
      showIndbrud: !state.showIndbrud,
      showGrundskyld: !state.showGrundskyld,
      showBoligpriser: !state.showBoligpriser
    }));
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.handleSubmit(event);
    //event.preventDefault()
  }


  render(){
    const selections = kommuner.map((i) => {
        return <option value={i.id} >{i.label}</option>
      }
    );
		return (
      <>
  		  <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Vælg din kommune:
              <select value={this.state.value} onChange={this.handleChange}>
                {selections}
              </select>
            </label>
            <input type="submit" value="Vælg" />
          </form>
  		  </div>
        <h1>Indbrud, anmeldelser og sigtelser</h1>
        <IndbrudIncluder show={this.state.showIndbrud} id={this.state.value} />
        <h1>Grundskyld pr. boligtype</h1>
        <GrundskyldIncluder show={this.state.showGrundskyld} id={this.state.value} />
        <h1>Boligpriser pr. boligtype</h1>
        <BoligpriserIncluder show={this.state.showBoligpriser} id={this.state.value} />
      </>
		);
  }
}

export default KommuneSelector;

const kommuner = [
  {id: "101", label: "København"},
  {id: "147", label: "Frederiksberg"},
  {id: "155", label: "Dragør"},
  {id: "185", label: "Tårnby"},
  {id: "165", label: "Albertslund"},
  {id: "151", label: "Ballerup"},
  {id: "153", label: "Brøndby"},
  {id: "157", label: "Gentofte"},
  {id: "159", label: "Gladsaxe"},
  {id: "161", label: "Glostrup"},
  {id: "163", label: "Herlev"},
  {id: "167", label: "Hvidovre"},
  {id: "169", label: "Høje-Taastrup"},
  {id: "183", label: "Ishøj"},
  {id: "173", label: "Lyngby-Taarbæk"},
  {id: "175", label: "Rødovre"},
  {id: "187", label: "Vallensbæk"},
  {id: "201", label: "Allerød"},
  {id: "240", label: "Egedal"},
  {id: "210", label: "Fredensborg"},
  {id: "250", label: "Frederikssund"},
  {id: "190", label: "Furesø"},
  {id: "270", label: "Gribskov"},
  {id: "260", label: "Halsnæs"},
  {id: "217", label: "Helsingør"},
  {id: "219", label: "Hillerød"},
  {id: "223", label: "Hørsholm"},
  {id: "230", label: "Rudersdal"},
  {id: "400", label: "Bornholm"},
  {id: "411", label: "Christiansø"},
  {id: "085", label: "Region Sjælland"},
  {id: "253", label: "Greve"},
  {id: "259", label: "Køge"},
  {id: "350", label: "Lejre"},
  {id: "265", label: "Roskilde"},
  {id: "269", label: "Solrød"},
  {id: "320", label: "Faxe"},
  {id: "376", label: "Guldborgsund"},
  {id: "316", label: "Holbæk"},
  {id: "326", label: "Kalundborg"},
  {id: "360", label: "Lolland"},
  {id: "370", label: "Næstved"},
  {id: "306", label: "Odsherred"},
  {id: "329", label: "Ringsted"},
  {id: "330", label: "Slagelse"},
  {id: "340", label: "Sorø"},
  {id: "336", label: "Stevns"},
  {id: "390", label: "Vordingborg"},
  {id: "083", label: "Region Syddanmark"},
  {id: "420", label: "Assens"},
  {id: "430", label: "Faaborg-Midtfyn"},
  {id: "440", label: "Kerteminde"},
  {id: "482", label: "Langeland"},
  {id: "410", label: "Middelfart"},
  {id: "480", label: "Nordfyns"},
  {id: "450", label: "Nyborg"},
  {id: "461", label: "Odense"},
  {id: "479", label: "Svendborg"},
  {id: "492", label: "Ærø"},
  {id: "530", label: "Billund"},
  {id: "561", label: "Esbjerg"},
  {id: "563", label: "Fanø"},
  {id: "607", label: "Fredericia"},
  {id: "510", label: "Haderslev"},
  {id: "621", label: "Kolding"},
  {id: "540", label: "Sønderborg"},
  {id: "550", label: "Tønder"},
  {id: "573", label: "Varde"},
  {id: "575", label: "Vejen"},
  {id: "630", label: "Vejle"},
  {id: "580", label: "Aabenraa"},
  {id: "082", label: "Region Midtjylland"},
  {id: "710", label: "Favrskov"},
  {id: "766", label: "Hedensted"},
  {id: "615", label: "Horsens"},
  {id: "707", label: "Norddjurs"},
  {id: "727", label: "Odder"},
  {id: "730", label: "Randers"},
  {id: "741", label: "Samsø"},
  {id: "740", label: "Silkeborg"},
  {id: "746", label: "Skanderborg"},
  {id: "706", label: "Syddjurs"},
  {id: "751", label: "Aarhus"},
  {id: "657", label: "Herning"},
  {id: "661", label: "Holstebro"},
  {id: "756", label: "Ikast-Brande"},
  {id: "665", label: "Lemvig"},
  {id: "760", label: "Ringkøbing-Skjern"},
  {id: "779", label: "Skive"},
  {id: "671", label: "Struer"},
  {id: "791", label: "Viborg"},
  {id: "081", label: "Region Nordjylland"},
  {id: "810", label: "Brønderslev"},
  {id: "813", label: "Frederikshavn"},
  {id: "860", label: "Hjørring"},
  {id: "849", label: "Jammerbugt"},
  {id: "825", label: "Læsø"},
  {id: "846", label: "Mariagerfjord"},
  {id: "773", label: "Morsø"},
  {id: "840", label: "Rebild"},
  {id: "787", label: "Thisted"},
  {id: "820", label: "Vesthimmerlands"},
  {id: "851", label: "Aalborg"}
]
