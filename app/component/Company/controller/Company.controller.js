sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "../model/comFormatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
      	"sap/m/MessageToast",
    ],
    function(Controller,comFormatter,Filter,FilterOperator,Sorter,Fragment,JSONModel,MessageToast) {
      "use strict";
      var totalNumber;
  
      return Controller.extend("project3.controller.Company", {
        comFormatter: comFormatter,
        onInit: function(){
          const MyRoute=this.getOwnerComponent().getRouter().getRoute("Company");
          MyRoute.attachPatternMatched(this.onMyPattern,this);
          this.getOwnerComponent().getRouter().getRoute("CompanyDetail").attachPatternMatched(this.onMyPattern, this);
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
          var TableIndex="협력 업체 목록(그리드 테이블) ("+totalNumber+")";
          this.getView().byId("CTableName").setText(TableIndex);
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

            var oTable = this.byId("CompanyUiTable").getBinding("rows");
            oTable.filter(aFilter);
        },

        onClear : function(){
          this.byId("ComNum").setValue("");
          this.byId("ComName").setValue("");
          this.byId("ComPerson").setValue("");
          this.byId("Date").setValue("");
          this.byId("Status").setSelectedKey("");

        },
        
        onReset : function(){
          this.onClear();
          this.onSearch();
        },

        onCreateCompany : function(){
          var ComOrder=this.getView().getModel("CompanyModel").oData;
          var ComNumIndex=ComOrder.length;
          var ComNum=(parseInt(ComOrder[ComNumIndex-1].comcode)+1).toString();
          this.getOwnerComponent().getRouter().navTo("CreateCompany",{num:ComNum});
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
          var oBinding = this.byId("CompanyUiTable").getBinding("rows");
          oBinding.sort(aSorters);
        },

        onMTable : function(){
          this.getOwnerComponent().getRouter().navTo("CompanyMTable");
        },

        onNavToDetail : function(oEvent){
          var comcode = oEvent.getParameters().row.mAggregations.cells[0].mProperties.text;
          this.getOwnerComponent().getRouter().navTo("CompanyDetail",{tabletype:"UiTable", comcode: comcode});
        },
        onDelete : async function(){
          var aIndices=this.byId("CompanyUiTable").getSelectedIndices();
          if(aIndices.length<1){
            MessageToast.show("no item selected");
          }
          var model=this.getView().getModel("CompanyModel");
          for(var i=0;i<aIndices.length;i++){
            var comcodeee=model.getProperty('/'+aIndices[i]+'/comcode');
            var urll = "/company/Company/"+comcodeee;
            await $.ajax({
              type:"delete",
              url:urll,
              contentType: "application/json;IEEE754Compatible=true"
            });
          }
          this.onDataView();
          console.log(model.getProperty('/'+aIndices[0]));

        }
      });
    }
);