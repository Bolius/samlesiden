// This module should be responsible for creating all graphs currently available

import AutoGrapher from "./auto-graph";

export default function GraphCreater(props) {
    const komKode = props.komKode;
    console.log(komKode)

    return (
        <div>

        <AutoGrapher
                    table={"STRAF22"}
                    komKode={[157,173]}
                    data={"indbrud_total"}
                    time={"*"}
                    showHeader={"true"}
                    graphType={"spline"}
                    />
        <AutoGrapher
                    table={"EJDSK3"}
                    komKode={[komKode]}
                    data={"grundskyld"}
                    time={"*"}
                    showHeader={"true"}
                    graphType={"spline"}
                    />

        </div>
    )
}