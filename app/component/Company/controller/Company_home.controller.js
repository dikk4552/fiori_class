sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project3.controller.Company_home", {
        onCompany_list : function(){
            this.getOwnerComponent().getRouter().navTo("Company");
        }

	});
});