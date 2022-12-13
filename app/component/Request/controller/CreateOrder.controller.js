sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(Controller,JSONModel) {
      "use strict";
      var Today, CreateNum, Ind;
      return Controller.extend("project2.controller.CreateOrder", {
        onInit: function(evt){
          const myRoute=this.getOwnerComponent().getRouter().getRoute("CreateOrder");
          myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        onMyRoutePatternMatched : async function(oEvent){
          this.onClear();
          CreateNum = oEvent.getParameter("arguments").num;

          var now=new Date();
          Today = now.getFullYear()+"-"+(now.getMonth()+1).toString().padStart(2,'0')
                  +"-"+now.getDate().toString().padStart(2,'0');

          this.getView().byId("ReqNum").setText(CreateNum);
          this.getView().byId("ReqDate").setText(Today);
        },

        onBack : function(){
          this.getOwnerComponent().getRouter().navTo("Request");
        },

        onCreate : async function(){
          var temp = {
            request_product : this.byId("ReqGood").getValue(),
            request_quantity : parseInt(this.byId("ReqQty").getValue()),
            requestor : this.byId("Requester").getValue(),
            request_reason : this.byId("ReqReason").getValue(),
            request_number : CreateNum,
            request_state : 'B',
            request_date : Today,
            requst_estimated_price : parseInt(this.byId("ReqPrice").getValue()),

          }
          await $.ajax({
            type:"POST",
            url: "/request/Request",
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(temp)
          });
          this.onBack();
          
        },

        onClear : function(){
          this.getView().byId("ReqGood").setValue("");
          this.getView().byId("ReqQty").setValue("");
          this.getView().byId("Requester").setValue("");
          this.getView().byId("ReqPrice").setValue("");
          this.getView().byId("ReqReason").setValue("");
        }
      });
    }
);
  