import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useBeforeUnload } from "react-router-dom";

export default ({

}) => {

    const [state, setState] = React.useState(null);

    useBeforeUnload(
        useCallback(() => {
          localStorage.stuff = state;
        }, [state])
    );

    useEffect(() => {
        if (state === null && localStorage.stuff != null) {
          setState(localStorage.stuff);
        }
    }, [state]);

    return(
        <>
            <Helmet>
                <title>manage</title>
            </Helmet>
            <div>manage page1</div>
            <Link to="/">home</Link>
        </>
    );
}