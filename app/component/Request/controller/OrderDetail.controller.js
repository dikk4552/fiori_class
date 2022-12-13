sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "../model/formatter",
        "sap/ui/core/Fragment"
    ],
    function(Controller,JSONModel,formatter,Fragment) {
      "use strict";
      var sObjectId,sUrl
      return Controller.extend("project2.controller.OrderDetail", {
        formatter: formatter, 
        onInit: function(){
          this.getOwnerComponent().getRouter().getRoute("OrderDetail").attachPatternMatched(this._onObjectMatched, this);
          this.getOwnerComponent().getRouter().getRoute("OrderDetailExpanded").attachPatternMatched(this._onObjectMatched2, this);
          var oData={layout:false};
          var layoutModel=new JSONModel(oData);
          this.getView().setModel(layoutModel,"layout");
        },

        _onObjectMatched : async function(oEvent){
          sObjectId = oEvent.getParameter("arguments").ReqNum;
          sUrl="/request/Request/"+sObjectId;
          const Request = await $.ajax({                      //다음 함수들이 이 이후에 실행되도록 함
            type: "get",
            url : sUrl
          });
        var RequestModel = new JSONModel(Request);
        this.getView().setModel(RequestModel,"RequestModel");
        this.getView().getModel("layout").setProperty("/layout",false);
        },

        _onObjectMatched2 : async function(oEvent){
          sObjectId = oEvent.getParameter("arguments").ReqNum;
          sUrl="/request/Request/"+sObjectId;
          const Request = await $.ajax({                      //다음 함수들이 이 이후에 실행되도록 함
            type: "get",
            url : sUrl
          });
        var RequestModel = new JSONModel(Request);
        this.getView().setModel(RequestModel,"RequestModel");
        this.getView().getModel("layout").setProperty("/layout",true);
        },

        onNavToBack : function(){
          this.getOwnerComponent().getRouter().navTo("Request");
        },

        onApproval : async function(){
          var temp={
            request_state : 'A'
          }
          await $.ajax({
            type:"PATCH",
            url:sUrl,
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(temp)
          });
          this.onNavToBack();
        },

        onReject : function(){
          if(!this.byId("RejectReasonDialog")){
            Fragment.load({
              id: this.getView().getId(),
              name : "project2.view.fragment.RejectReason",
              controller: this
            }).then(function(oDialog){
              this.getView().addDependent(oDialog);
              oDialog.open();
            }.bind(this));
          }else{
            this.byId("RejectReasonDialog").open();
          }

          
        },

        onCloseDialog : function(){
          this.byId("RejectReasonDialog").destroy();
          this.pDialog=null;
        },

        onSubmit : async function(){
          var rejectreason = this.byId("rejectreason").getValue();
          var temp={
            request_reject_reason : rejectreason,
            request_state : 'C'
          }
          await $.ajax({
            type:"PATCH",
            url:sUrl,
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(temp)
          });
          this.byId("rejectreason").setValue("");
          this.onCloseDialog();
          this.onNavToBack();
        },

        onfull : function(){
          this.getOwnerComponent().getRouter().navTo("OrderDetailExpanded",{ReqNum:sObjectId});
        },

        onexitfull : function(){
          this.getOwnerComponent().getRouter().navTo("OrderDetail",{ReqNum:sObjectId});
        }
      });
    }
);
  