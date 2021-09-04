import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const BackButton = (props) => {
    let history = useHistory();

    let tooltipText = (props.tooltip === undefined)? "Back to previous page": props.tooltip;

    return (
      <React.Fragment>
        <Tooltip title={tooltipText}>
          <IconButton color="primary" aria-label={tooltipText} onClick={() => history.goBack()} >
            <i className="fas fa-angle-double-left fa-2x"></i>
          </IconButton>
        </Tooltip>
      </React.Fragment >
    );
};

export default BackButton;