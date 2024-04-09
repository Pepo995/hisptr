import React from "react";
import clientone from "@images/home/client/GQ.png";
import clienttwo from "@images/home/client/capital-one.png";
import clientthree from "@images/home/client/chase.png";
import clientfour from "@images/home/client/hilton.png";
import clientfive from "@images/home/client/google.png";
import clientsix from "@images/home/client/adidas.png";
import clientseven from "@images/home/client/newyork.png";
import clienteight from "@images/home/client/southwest.png";
import clientnine from "@images/home/client/swarovski.png";
import clientten from "@images/home/client/chopard.png";
import clienteleven from "@images/home/client/cnicks.png";
import clienttwel from "@images/home/client/swatch.png";
import clientthirteen from "@images/home/client/wells-fargo.png";
import clientfourteen from "@images/home/client/whole-food.png";
import clientfifteen from "@images/home/client/discovery.png";
import clientsixteen from "@images/home/client/facebook.png";
import clientsventeen from "@images/home/client/lorial.png";
import clienteighteen from "@images/home/client/pepsico.png";

const Client = () => {
  return (
    <div className="client-div padding-100">
      <div className="container">
        <div className="title-div text-center">
          <p className="font-56px sy-tx-black">
            OUR <span className="sy-tx-primary">Clients</span>
          </p>
        </div>
        <div className="client-logo-div">
          <div className="row align-items-center text-center">
            <div className="col-md-3">
              <img src={clientone.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clienttwo.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientthree.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientfour.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientfive.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientsix.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientseven.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clienteight.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientnine.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientten.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clienteleven.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clienttwel.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientthirteen.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientfourteen.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientfifteen.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientsixteen.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clientsventeen.src} alt="logo-client" />
            </div>
            <div className="col-md-3">
              <img src={clienteighteen.src} alt="logo-client" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
