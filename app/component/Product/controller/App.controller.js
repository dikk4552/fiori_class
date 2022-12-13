sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("project4.controller.App", {
        onInit() {
        },
        onCompany : function(){
          this.getOwnerComponent().getRouter().navTo("Company");
        },
        onRequest : function(){
          this.getOwnerComponent().getRouter().navTo("Request");
        },
        onRequestState : function(){
          this.getOwnerComponent().getRouter().navTo("Request");
        },
        onProductList : function(){
          this.getOwnerComponent().getRouter().navTo("ProductList_Grid");
        }
      });
    }
  );
  