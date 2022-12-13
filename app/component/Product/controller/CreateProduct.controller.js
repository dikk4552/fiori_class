sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("project4.controller.CreateProduct", {
        onInit: function(){
        },

        onBack : function(){
          this.getOwnerComponent().getRouter().navTo("ProductList_Grid");
        }
      });
    }
);