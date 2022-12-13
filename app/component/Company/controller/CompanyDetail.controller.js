sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "../model/comFormatter"
    ],
    function(Controller,JSONModel,comFormatter) {
      "use strict";
      var sTableType,sUrl,sComcode;
      var CompanyModel;
      return Controller.extend("project3.controller.CompanyDetail", {
        comFormatter: comFormatter,
        onInit: function(){
          const MyRoute=this.getOwnerComponent().getRouter().getRoute("CompanyDetail");
          MyRoute.attachPatternMatched(this.onObjectMatched,this);
          this.getOwnerComponent().getRouter().getRoute("CompanyMDetail").attachPatternMatched(this.onObjectMatched, this);
          this.getOwnerComponent().getRouter().getRoute("CompanyDetailExpanded").attachPatternMatched(this.onObjectMatched2, this);
          this.getOwnerComponent().getRouter().getRoute("CompanyMDetailExpanded").attachPatternMatched(this.onObjectMatched2, this);
          var oData={layout:false};
          var layoutModel=new JSONModel(oData);
          this.getView().setModel(layoutModel,"layout");
        },

        onObjectMatched : async function(oEvent){
          var ed={
            EditMode : false
          }
          var oModel = new JSONModel(ed);
          this.getView().setModel(oModel,"oModel");
          sComcode = oEvent.getParameter("arguments").comcode;
          sTableType = oEvent.getParameter("arguments").tabletype;
          sUrl="/company/Company/"+sComcode;
          const Company = await $.ajax({
            type:"get",
            url : sUrl
          });
          // CompanyModel2= new JSONModel(Company);
          CompanyModel= new JSONModel(Company);
          this.getView().setModel(CompanyModel,"CompanyModel")
          // this.getView().setModel(CompanyModel2,"CompanyModel2");
          this.getView().getModel("layout").setProperty("/layout",false);
        },

        onObjectMatched2 : async function(oEvent){
          var ed={
            EditMode : false
          }
          var oModel = new JSONModel(ed);
          this.getView().setModel(oModel,"oModel");
          sComcode = oEvent.getParameter("arguments").comcode;
          sTableType = oEvent.getParameter("arguments").tabletype;
          sUrl="/company/Company/"+sComcode;
          const Company = await $.ajax({
            type:"get",
            url : sUrl
          });
          // CompanyModel2= new JSONModel(Company);
          CompanyModel= new JSONModel(Company);
          this.getView().setModel(CompanyModel,"CompanyModel")
          // this.getView().setModel(CompanyModel2,"CompanyModel2");
          this.getView().getModel("layout").setProperty("/layout",true);
        },

        onNavToBack : function(){
          if(sTableType==="MTable"){
            this.getOwnerComponent().getRouter().navTo("CompanyMTable");
          }else{
            this.getOwnerComponent().getRouter().navTo("Company");
          }
          
        },

        onEdit : function(){
          var oldcomname=this.byId("ComName").getText();
          this.byId("ComNameInput").setValue(oldcomname);
          var oldcomadd=this.byId("ComAddress").getText();
          this.byId("ComAddressInput").setValue(oldcomadd);
          var oldcomperson=this.byId("ComPerson").getText();
          this.byId("ComPersonInput").setValue(oldcomperson);
          var oldcomcontact=this.byId("ComContact").getText();
          this.byId("ComContactInput").setValue(oldcomcontact);
          var oldgood=this.byId("Good").getText();
          this.byId("GoodInput").setValue(oldgood);
          var oldstate=this.byId("oldstate").getText();
          if(oldstate==="보류"){
            this.byId("Comstate").setSelectedKey("hold");
          }else if(oldstate==="신뢰"){
            this.byId("Comstate").setSelectedKey("trust");
          }else if(oldstate==="주의"){
            this.byId("Comstate").setSelectedKey("caution");
          }else{
            this.byId("Comstate").setSelectedKey("hold");
          }
          
          this.getView().getModel("oModel").setProperty("/EditMode",true);
        },

        onConfirm : async function(){
          var tempp={
            comname : this.byId("ComNameInput").getValue(),
            comaddress : this.byId("ComAddressInput").getValue(),
            comperson : this.byId("ComPersonInput").getValue(),
            comcontact : this.byId("ComContactInput").getValue(),
            comgood : this.byId("GoodInput").getValue(),
            comstate : this.byId("Comstate").getSelectedKey()
          }

          await $.ajax({
            type:"PATCH",
            url:sUrl,
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(tempp)
          });
          // this.getView().setModel(CompanyModel2,"CompanyModel");
          // if(this.byId("ComName").getText()!==this.byId("ComNameInput").getValue()){
          //   this.byId("ComName").setText(this.byId("ComNameInput").getValue());
          // }
          //this.getView().getModel("oModel").setProperty("/EditMode",false);
          this.onCancel();
          this.onNavToBack();
        },

        onCancel : function(){
          this.byId("ComNameInput").setValue("");
          this.byId("ComAddressInput").setValue("");
          this.byId("ComPersonInput").setValue("");
          this.byId("ComContactInput").setValue("");
          this.byId("GoodInput").setValue("");
          this.getView().getModel("oModel").setProperty("/EditMode",false);
        },
        
        onfull : function(){
          //if(sTableType==="Mtable"){
          //   console.log("mtableexpand");
          //   this.getOwnerComponent().getRouter().navTo("CompanyMDetailExpanded",{tabletype: sTableType, comcode:sComcode});
          // }else{
          //   console.log("uitableexpand");
          console.log(sTableType);
            this.getOwnerComponent().getRouter().navTo("CompanyDetailExpanded",{tabletype: sTableType, comcode:sComcode});
          //}
          
        },

        onexitfull : function(){
          if(sTableType==="MTable"){
            console.log(sTableType);
            console.log("mtableexitexpand");
            this.getOwnerComponent().getRouter().navTo("CompanyMDetail",{tabletype: sTableType, comcode:sComcode});
          }else{
            console.log(sTableType);
            console.log("uitableexitexpand");
            this.getOwnerComponent().getRouter().navTo("CompanyDetail",{tabletype: sTableType, comcode:sComcode});
          }
          
        }
        
      });
    }
);