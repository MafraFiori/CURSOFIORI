sap.ui.define([
    "zappcursorick/controller/App.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zappcursorick.controller.Detalhe", {
            onInit: function () {
                this.getRouter().getRoute("RouteDetalhe").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function(oEvent){
                let id = oEvent.getParameter("arguments").id;

                MessageBox.success("Navegação realizada usando o parameto - " + id)
            }


        });
    });
