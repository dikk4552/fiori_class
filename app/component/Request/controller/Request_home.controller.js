sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel"
], function(Controller,formatter,JSONModel) {
	"use strict";

	return Controller.extend("project2.controller.Request_home", {
		formatter:formatter,
		onInit : async function(){
			this.getOwnerComponent().getRouter().getRoute("Request_home").attachPatternMatched(this.onMatched,this);
		},

		onMatched : async function(){
			const Rqholdlist=await $.ajax({
				type:"get",
				url:"/request/Request?$filter=request_state eq 'B'&$orderby=request_number&$top=3"
			});
			var RqholdModel=new JSONModel(Rqholdlist.value);
			this.getView().setModel(RqholdModel,"RqholdModel");

			const Rqstatesum=await $.ajax({
				type:"get",
				url:"/request/Request?$apply=groupby((request_state),aggregate(request_number%20with%20countdistinct%20as%20total))"
			});
			var RqstatesumModel=new JSONModel(Rqstatesum.value);
			this.getView().setModel(RqstatesumModel,"RqstatesumModel");
		},

        onRequest_list : function(){
            this.getOwnerComponent().getRouter().navTo("Request");
        },

		onNavToDetail: function(oEvent){
			var sPath=oEvent.getSource().oBindingContexts.RqholdModel.sPath;
			var rn=this.getView().getModel("RqholdModel").getProperty(sPath).request_number;
			this.getOwnerComponent().getRouter().navTo("OrderDetailExpanded",{ReqNum: rn});
		},

		onRequest_chart : function(){
			this.getOwnerComponent().getRouter().navTo("Request_chart");
        },

		onState : function(){
			
		}
	});
});