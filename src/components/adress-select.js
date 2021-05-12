import React, { useState, useEffect } from "react";
import { Col, Input, Form} from "reactstrap";
import { BeatLoader as Loader } from "react-spinners";
import * as dawaModule from "dawa-autocomplete2";
import Modal from "react-responsive-modal";

export default function AdressSelect(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataFailed, setDataFailed] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [dawa, setDawa] = useState(dawaModule);
  let handle_dawa_resp = select => {
    setIsLoading(true);
    setInputAddress("");
    setDawa(dawaModule);
    console.log("Vejnavn: " + select.tekst)
    props.setAddress(select.data.kommunekode.substring(1,4),select.data.postnrnavn, select.tekst);
    //document.getElementById("dawa-autocomplete-input").innerHTML = select.tekst;
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      dawa.dawaAutocomplete(
        document.getElementById("dawa-autocomplete-input"),
        {
          select: dawa_resp => {
            handle_dawa_resp(dawa_resp)
            console.log(dawa_resp)
          }
          
        }
      );
    }
  });

  return (
    <div>
      <h2>Indtast adresse</h2>
      
      <Form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
      <div className="autocomplete-container">
        <Input
            type="search"
            value={inputAddress}
            onChange={event => {
              setInputAddress(event.target.value);
            }}
            id="dawa-autocomplete-input"
            placeholder="Indtast adresse...."
        />
      </div>
      </Form>
        <Modal open={dataFailed} closeOnEsc onClose={() => setDataFailed(false)}>
          <Col>
            <p>
              Fejlbesked, ved mangel på respons fra service
            </p>
          </Col>
      </Modal>
    </div>
  );
}
