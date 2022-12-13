sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(Controller,JSONModel) {
      "use strict";
      
      var ComNum, Today;

      return Controller.extend("project3.controller.CreateCompany", {
        onInit: function(){
          const myRoute=this.getOwnerComponent().getRouter().getRoute("CreateCompany");
          myRoute.attachPatternMatched(this.onPMatched,this);
        },

        onPMatched : async function(oEvent){
          this.onClear();
          ComNum=oEvent.getParameter("arguments").num;

          var now=new Date();
          Today = now.getFullYear()+"-"+(now.getMonth()+1).toString().padStart(2,'0')
                  +"-"+now.getDate().toString().padStart(2,'0');
          
          this.getView().byId("ComNum").setText(ComNum);
          this.getView().byId("Date").setText(Today);
        },

        onBack : function(){
          this.getOwnerComponent().getRouter().navTo("Company");
        },

        onCreate : async function(){
          var temp={
            comcode : ComNum,
            comname : this.byId("ComName").getValue(),
            comaddress : this.byId("ComAddress").getValue(),
            comperson : this.byId("ComPerson").getValue(),
            comcontact : this.byId("ComContact").getValue(),
            comgood : this.byId("Good").getValue(),
            comdate : Today,
            comstate : "hold"
          }
          await $.ajax({
            type:"post",
            url:"/company/Company",
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(temp)
          });
          this.onBack();
        },

        onClear : function(){
          this.getView().byId("ComName").setValue("");
          this.getView().byId("ComAddress").setValue("");
          this.getView().byId("ComPerson").setValue("");
          this.getView().byId("ComContact").setValue("");
          this.getView().byId("Good").setValue("");

        }
      });
    }
);