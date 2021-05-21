import React from 'react';
class Grafkonfigurator extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <h3>emne/kommunekode/tid/visOverskrift/graftype</h3>   
        <table>
            <tr>
                <th>Tabel</th>
                <th>Emne</th>
                <th>Kommunekode</th>
                <th>Tid</th>
                <th>Vis overskrift</th>
                <th>Graftype</th>
            </tr>
            <tr>
                <td>STRAF22</td>
                <td>indbrud</td>
                <td>123</td>
                <td>Uden kvartal</td>
                <td>true | false</td>
                <td>graftype</td>
            </tr>
            <tr>
                <td></td>
                <td>boligpriser</td>
                <td>123</td>
                <td>Med kvartal</td>
                <td>true | false</td>
                <td>graftype</td>
            </tr>
            <tr>
                <td>EJDSK3</td>
                <td>grundskyld</td>
                <td>123</td>
                <td>Med kvartal</td>
                <td>true | false</td>
                <td>graftype</td>
            </tr>
            </table>
            <br />
            <table>
            <tr>
                <th>Attibute</th>
                <th>Values</th>
            </tr>
            <tr>
                <td>Tid med kvartal</td>
                <td>* | {'>'}=2010K2 | {'<'}=2020K4 | == 2015K2 </td>
            </tr>
            <tr>
                <td>Tid uden kvartal</td>
                <td>* | {'>'}=2010 | {'<'}=2020 | == 2015 </td>
            </tr>
            <tr>
                <td>Graftype</td>
                <td>line | spline | stepLine | bars | area | splineArea | stepArea | waterfall | column | scatter | bubble</td>
            </tr>
        </table> 
      </div>
	);
  }
}

export default Grafkonfigurator;