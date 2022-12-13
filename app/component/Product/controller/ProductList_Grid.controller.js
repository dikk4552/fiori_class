sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "../model/ProductFormatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/ui/core/Fragment"
        
    ],
    function(Controller,ProductFormatter,Filter,FilterOperator,Sorter,Fragment){
        "use strict";
        return Controller.extend("project4.controller.ProductList_Grid",{
            ProductFormatter : ProductFormatter,
            onInit: function(){
            },

            onSearch : function(){
                var category=this.byId("category").getValue();
                var code=this.byId("code").getValue();
                var name=this.byId("name").getValue();
                var date=this.byId("date").getValue();
                var produce=this.byId("produce").getSelectedKey();
                var Pfilter=[];
                if(category){Pfilter.push(new Filter("category",FilterOperator.Contains,category))}
                if(code){Pfilter.push(new Filter("code",FilterOperator.Contains,code))}
                if(name){Pfilter.push(new Filter("name",FilterOperator.Contains,name))}
                if(date){Pfilter.push(new Filter("date",FilterOperator.Contains,date))}
                if(produce){Pfilter.push(new Filter("produce",FilterOperator.Contains,produce))}
                var oTable=this.byId("PrListGridTable").getBinding("rows");
                oTable.filter(Pfilter);
            },

            onReset : function(){
                this.byId("category").setValue("");
                this.byId("code").setValue("");
                this.byId("name").setValue("");
                this.byId("date").setValue("");
                this.byId("produce").setSelectedKey("");

                this.onSearch();
            },

            onSort : function(){
                if(!this.byId("ProdSortDialog")){
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "project4.view.fragment.ProdSortDialog",
                        controller : this
                    }).then(function(oDialog){
                        this.getView().addDependent(oDialog);
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.byId("ProdSortDialog").open();
                }
            },

            onhandleConfirm : function(oEvent){
                var mParams = oEvent.getParameters();
                var sPath = mParams.sortItem.getKey();
                var bDescending = mParams.sortDescending;
                var PSorters=[];
                PSorters.push(new Sorter(sPath,bDescending));
                var oBinding=this.byId("PrListGridTable").getBinding("rows");
                oBinding.sort(PSorters);
            },

            onValueHelpRequest : function(){
                if(!this.byId("ValueHelpDialog")){
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "project4.view.fragment.ValueHelpDialog",
                        controller : this
                    }).then(function(oDialog){
                        this.getView().addDependent(oDialog);
                        oDialog.open();
                    }.bind(this));
                }else{
                    this.byId("ValueHelpDialog").open();
                }
            },
            onCloseDialog : function(){
                this.onDReset();
                this.byId("ValueHelpDialog").close();
            },

            onDSearch : function(){
                var Dcode=this.byId("Dcode").getValue();
                var Dname=this.byId("Dname").getValue();
                var filter=[];
                if(Dcode){filter.push(new Filter("code",FilterOperator.Contains,Dcode))}
                if(Dname){filter.push(new Filter("name",FilterOperator.Contains,Dname))}
                var oTable=this.byId("vhTable").getBinding("rows");
                oTable.filter(filter);
            },

            onDReset : function(){
                this.byId("Dcode").setValue("");
                this.byId("Dname").setValue("");

                this.onDSearch();
            },

            onCellClick : function(oEvent){
                var mParams = oEvent.getParameters();
                var sPath=mParams.rowBindingContext.sPath;
                var code=sPath+"/code";
                var name=sPath+"/name"
                var data1 = this.getView().getModel("ProductList").getProperty(code);
                var data2 = this.getView().getModel("ProductList").getProperty(name);

                this.byId("code").setValue(data1);
                this.byId("name").setValue(data2);

                this.onDReset();
                this.byId("ValueHelpDialog").close();
            },

            onCreateProduct : function(){
                this.getOwnerComponent().getRouter().navTo("CreateProduct");
            },

            onPrListMTable : function(){
                this.getOwnerComponent().getRouter().navTo("PrListMTable");
            }

        });
    }

);