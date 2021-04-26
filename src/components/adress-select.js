import React, { useState, useEffect } from "react";
import { Row, Col, Input, Form, Button } from "reactstrap";
import { BeatLoader as Loader } from "react-spinners";
import * as dawaModule from "dawa-autocomplete2";
import Modal from "react-responsive-modal";
import getKomKode from "./kommune-select.js";

export default function AdressSelect(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataFailed, setDataFailed] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [dawa, setDawa] = useState(dawaModule);
  let handle_dawa_resp = bbr_id => {
    setIsLoading(true);
    getKomKode(bbr_id, resp => {
      if (resp.failed) {
        setDataFailed(true);
        setIsLoading(false);
        setInputAddress("");
        setDawa(dawaModule);
      } else {
        console.log(inputAddress);
        console.log(resp)
        props.setAdress(resp.substring(1,4));
        document.getElementById("dawa-autocomplete-input").innerHTML = "";
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!isLoading) {
      dawa.dawaAutocomplete(
        document.getElementById("dawa-autocomplete-input"),
        {
          select: dawa_resp => handle_dawa_resp(dawa_resp.data.id)
        }
      );
    }
    // Check if id is set in query param
    const params = window.location.search.split("&");
    for (var param of params) {
      if (param.includes("unadr_bbrid=")) {
        const unit_bbr = param.split("=")[1];
        handle_dawa_resp(unit_bbr);
      }
    }
  });

  return (
    <div>
      <h2>Find relevante grafer, baseret på indtastede adresse</h2>
      
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
        <Button color="primary">Se grafer</Button>
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
