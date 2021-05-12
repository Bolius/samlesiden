import { useState } from "react";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 100px;
  border-color: #ee5c47;
`;

function App() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  return (
    <BeatLoader color={color} loading={loading} css={override} size={150} />
  );
}

export default App;