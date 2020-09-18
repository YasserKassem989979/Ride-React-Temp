import React, { useState } from "react";
import styles from "./userDocuments.module.css";
import config from "../../config/backendURLS";
import idCard from "../../assets/idCard.png";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import ActionsMenu from "../actionsMenu/actionsMenu";
import { translate } from "../../utils/translate";
import moment from "moment";

const UserDocuments = props => {
    //create an array to save the rotation for an image
    let rotateArray = new Array(0);
    if (props.documents && props.documents.length > 0) {
        rotateArray = new Array(props.documents.length);
        rotateArray.fill(0);
    }
    let rotateArrayToo = new Array(0);
    if (props.vehicles && props.vehicles[0].documents.length > 0) {
        rotateArrayToo = new Array(props.vehicles[0].documents.length);
        rotateArrayToo.fill(0);
    }
    //rotation array
    const [rotateIndices, setRotateIndices] = useState(rotateArray);
    //rotation array
    const [rotateIndicesToo, setRotateIndicesToo] = useState(rotateArrayToo);
    // which image should i rotate
    const rotateFunc = index => {
        let newRotateArray = [...rotateIndices];
        newRotateArray[index] = newRotateArray[index] + 90;
        setRotateIndices(newRotateArray);
    };

    const rotateFuncToo = index => {
        let newRotateArray = [...rotateIndicesToo];
        newRotateArray[index] = newRotateArray[index] + 90;
        setRotateIndicesToo(newRotateArray);
    };

    return (
        <div className={styles.container}>
            {props.documents &&
                props.documents.length > 0 &&
                props.documents.map((document, index) => {
                    return (
                        <div key={document.image} className={styles.documentsWraper}>
                            <div style={{ margin: "0px" }} className={styles.titleWraper}>
                                <h4 style={{ margin: 0 }}>{document.name}</h4>
                                <IconButton onClick={() => rotateFunc(index)}>
                                    <RefreshIcon />
                                </IconButton>
                                <ActionsMenu
                                    object='DOCUMENT'
                                    status={document.verification_status}
                                    onActionClicked={props.onActionClicked}
                                    document_id={document.id}
                                    documentDate={moment(document.expiration_date)}
                                />
                            </div>
                            <div style={{ margin: "0 0 35px 0" }} className={styles.titleWraper}>
                                {document.expiration_date ? <p style={{ margin: 0 }}>{translate("EXPIRATION_DATE")}:</p> : null}
                                <p style={{ margin: "0px 5px" }}>{document.expiration_date}</p>
                                <p style={{ margin: "0 5px" }}>{translate("STATUS")}:</p>
                                <p style={{ margin: 0 }}>{translate(document.verification_status)}</p>
                                {document.number ? <p style={{ margin: "0px 10px" }}>{translate("DOCUMENT_NUMBER")}:</p> : null}
                                <p style={{ margin: "0px 5px" }}>{document.number}</p>
                            </div>
                            <div
                                className={styles.imgWraper}
                                style={{ transition: "all 0.3s", transform: `rotate(${rotateIndices[index]}deg)` }}>
                                <img
                                    src={document.image ? `${config.hostDomain}${document.image}` : idCard}
                                    alt='id card'
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    );
                })}
            {props.isDriver &&
                props.vehicles &&
                props.vehicles.length > 0 &&
                props.vehicles[0].documents.map((document, index) => {
                    return (
                        <div key={document.image} className={styles.documentsWraper}>
                            <div style={{ margin: "0px" }} className={styles.titleWraper}>
                                <h4 style={{ margin: 0 }}>{document.name}</h4>
                                <IconButton onClick={() => rotateFuncToo(index)}>
                                    <RefreshIcon />
                                </IconButton>
                            </div>
                            <div style={{ margin: "0 0 35px 0" }} className={styles.titleWraper}>
                                {document.expiration_date ? <p style={{ margin: 0 }}>{translate("EXPIRATION_DATE")}:</p> : null}
                                <p style={{ margin: "0px 5px" }}>{document.expiration_date}</p>
                                <p style={{ margin: "0 5px" }}>{translate("STATUS")}:</p>
                                <p style={{ margin: 0 }}>{translate(document.verification_status)}</p>
                                {document.number ? <p style={{ margin: "0px 10px" }}>{translate("DOCUMENT_NUMBER")}:</p> : null}
                                <p style={{ margin: "0px 5px" }}>{document.number}</p>
                            </div>
                            <div
                                className={styles.imgWraper}
                                style={{ transition: "all 0.3s", transform: `rotate(${rotateIndicesToo[index]}deg)` }}>
                                <img
                                    src={document.image ? `${config.hostDomain}${document.image}` : idCard}
                                    alt='id card'
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default UserDocuments;
