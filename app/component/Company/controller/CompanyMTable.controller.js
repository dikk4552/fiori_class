sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "../model/comFormatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/ui/core/Fragment",
      "sap/ui/model/json/JSONModel"
    ],
    function(Controller,comFormatter,Filter,FilterOperator,Sorter,Fragment, JSONModel) {
      "use strict";
      var totalNumber;
  
      return Controller.extend("project3.controller.CompanyMTable", {
        comFormatter: comFormatter,
        onInit: function(){
          const MyRoute=this.getOwnerComponent().getRouter().getRoute("CompanyMTable");
          MyRoute.attachPatternMatched(this.onMyPattern,this);
          this.getOwnerComponent().getRouter().getRoute("CompanyMDetail").attachPatternMatched(this.onMyPattern, this);
        },

        onMyPattern : function(){
          this.onClear();
          this.onDataView();
        },

        onDataView : async function(){
          const Company = await $.ajax({
            type:"get",
            url:"/company/Company"
          });
          var CompanyModel = new JSONModel(Company.value);
          this.getView().setModel(CompanyModel,"CompanyModel");
          totalNumber = this.getView().getModel("CompanyModel").oData.length;
          var TableIndex="협력 업체 목록(반응형 테이블) ("+totalNumber+")";
          this.getView().byId("CTableName").setText(TableIndex);
        },

        onClear : function(){
          this.byId("ComNum").setValue("");
          this.byId("ComName").setValue("");
          this.byId("ComPerson").setValue("");
          this.byId("Date").setValue("");
          this.byId("Status").setSelectedKey("");

        },

        onSearch : function(){
            var ComNum = this.byId("ComNum").getValue();
            var ComName = this.byId("ComName").getValue();
            var ComPerson = this.byId("ComPerson").getValue();
            var Date = this.byId("Date").getValue();
            var Status = this.byId("Status").getSelectedKey();
            
            var aFilter=[];
            if(ComNum) {aFilter.push(new Filter("comcode",FilterOperator.Contains, ComNum))}
            if(ComName) {aFilter.push(new Filter("comname",FilterOperator.Contains, ComName))}
            if(ComPerson) {aFilter.push(new Filter("comperson",FilterOperator.Contains, ComPerson))}
            if(Date) {aFilter.push(new Filter("comdate",FilterOperator.Contains, Date))}
            if(Status) {aFilter.push(new Filter("comstate",FilterOperator.Contains, Status))}

            var oTable = this.byId("CompanyMTable").getBinding("items");
            oTable.filter(aFilter);
        },
        
        onReset : function(){
          this.onClear();

          this.onSearch();
        },

        onSort : function(){
          if(!this.byId("ComSortDialog")){
            Fragment.load({
              id: this.getView().getId(),
              name : "project3.view.fragment.ComSortDialog",
              controller: this
            }).then(function(oDialog){
              this.getView().addDependent(oDialog);
              oDialog.open();
            }.bind(this));
          }else{
            this.byId("ComSortDialog").open();
          }
        },

        onhandleConfirm : function(oEvent){
          var mParams = oEvent.getParameters();
          var sPath = mParams.sortItem.getKey();
          var bDescending = mParams.sortDescending;
          let aSorters=[];
          aSorters.push(new Sorter(sPath,bDescending));
          var oBinding = this.byId("CompanyMTable").getBinding("items");
          oBinding.sort(aSorters);
        },

        onUiTable : function(){
          this.getOwnerComponent().getRouter().navTo("Company");
        },

        onNavToDetail:function(oEvent){
          var comcode=oEvent.getSource().mAggregations.cells[0].mProperties.text;
          this.getOwnerComponent().getRouter().navTo("CompanyMDetail",{tabletype:"MTable", comcode: comcode});
        }
      });
    }
);