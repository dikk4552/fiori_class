sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
],
    function (Controller,
	formatter,
	MessageToast,
	Filter,
	FilterOperator,
	Fragment,
	Sorter,
	JSONModel,
	Spreadsheet,
    library) {
        "use strict";
        var totalNumber;
        const EdmType=library.EdmType;

        return Controller.extend("project2.controller.Request", {
            formatter: formatter,                                                           //직접 만들어놓은 formatter 사용
            
            onInit: function () {                             //비동기

                const MyRoute=this.getOwnerComponent().getRouter().getRoute("Request");
                MyRoute.attachPatternMatched(this.onMyPattern,this);
                this.getOwnerComponent().getRouter().getRoute("OrderDetail").attachPatternMatched(this.onMyPattern, this);
            },

            onMyPattern : function(){
                this.onClear();
                this.onDataView();
            },

            onDataView : async function(){
                const Request = await $.ajax({                      //다음 함수들이 이 이후에 실행되도록 함
                    type: "get",
                    url : "/request/Request"
                });
                var RequestModel = new JSONModel(Request.value);
                this.getView().setModel(RequestModel,"RequestModel");

                totalNumber = this.getView().getModel("RequestModel").oData.length;
                var TableIndex="물품 요청 목록 (" + totalNumber + ")";
                this.getView().byId("TableName").setText(TableIndex);
                this.byId("AllChk").setSelected(false);
            },
            
            getSelectedRow : function(evt){
                var SelectedItem = this.getView().byId("RequestTable").getSelectedIndex();
                var temp1 = "/RequestOrder/" +SelectedItem +"/ReqNum";
                var temp = "/RequestOrder/" +SelectedItem +"/Requester";
                var data1 = this.getView().getModel("Request").getProperty(temp1);
                var data = this.getView().getModel("Request").getProperty(temp);
                MessageToast.show(data1+"\n"+data);
                
                
            },
            onSearch : function(){
                var ReqNum = this.byId("ReqNum").getValue();
                var ReqGood = this.byId("ReqGood").getValue();
                var Requester = this.byId("Requester").getValue();
                var ReqStatus = this.byId("ReqStatus").getSelectedKey();
                var ReqDate = this.byId("ReqDate").getValue();
                if(ReqDate){
                    var ReqYear=ReqDate.split(". ")[0];
                    var ReqMonth = ReqDate.split(". ")[1].padStart(2,'0');
                    ReqDate = ReqYear + "-" + ReqMonth;
                }

                var aFilter =[];

                if(ReqNum) {aFilter.push(new Filter("request_number",FilterOperator.Contains, ReqNum))}
                if(ReqGood) {aFilter.push(new Filter("request_product",FilterOperator.Contains, ReqGood))}
                if(Requester) {aFilter.push(new Filter("requestor",FilterOperator.Contains, Requester))}
                if(ReqDate) {aFilter.push(new Filter("request_date",FilterOperator.Contains, ReqDate,))}
                if(ReqStatus) {aFilter.push(new Filter("request_state",FilterOperator.Contains, ReqStatus))}

                let oTable=this.byId("RequestTable").getBinding("rows");
                oTable.filter(aFilter);
            },

            onClear : function(){
                this.byId("ReqNum").setValue("");
                this.byId("ReqGood").setValue("");
                this.byId("Requester").setValue("");
                this.byId("ReqStatus").setSelectedKey("");
                this.byId("ReqDate").setValue("");
            },

            onReset : function(){
                this.onClear();

                this.onSearch();
            },

            onSort : function(){
                if(!this.byId("SortDialog")){                                   //dialog가 생성된 적이 없다면
                    Fragment.load({                                             //fragment load
                        id: this.getView().getId(),                             //id값 정의
                        name: "project2.view.fragment.SortDialog",              //load할 fragment 파일 경로
                        controller : this                                       //해당 dialog에 연결된 함수를 실행할 controller 정의
                    }).then(function(oDialog){                                  //load가 되었다면, 로드된 정보를 oDialog라고 정의
                        this.getView().addDependent(oDialog);                   //oDialog의 생명주기를 종속시켜줌
                        oDialog.open();                                         //화면에서 열기(화면에 띄움)
                    }.bind(this));                                              //함수의 this가 아닌 controller를 의미하는 this로 연결시킴
                } else{                                                         //dialog가 한번이라도 생성된적 있다면
                    this.byId("SortDialog").open();                     //dialog open(이전값이 유지되어도 괜찮은 sorting dialog의 경우 굳이 초기화 시키지않고 그냥 다시 open)
                }
            },

            handleConfirm : function(oEvent){
                let mParams = oEvent.getParameters();                           //
                let sPath=mParams.sortItem.getKey();                            //선택한 항목의 key값 가져옴
                let bDescending=mParams.sortDescending;                         //true일 경우 내림차순, false일 경우 오름차순
                let aSorters=[];
                aSorters.push(new Sorter(sPath, bDescending));                  //bDescending 변수 대신 직접 true/false 작성해도 됨
                let oBinding=this.byId("RequestTable").getBinding("rows");
                oBinding.sort(aSorters);

            },

            onCreateOrder : function(){
                var CreateOrder=this.getView().getModel("RequestModel").oData;
                var CreateOrderIndex=CreateOrder.length;
                var CreateNum=(parseInt(CreateOrder[CreateOrderIndex-1].request_number)+1).toString();
                this.getOwnerComponent().getRouter().navTo("CreateOrder",{num:CreateNum});      //manifest나 component에 정의해놓은 정보 가져오기 위해 getOwnerComponent 사용,
                                                                                //그 안에 route정보를 가져오기 위해 getRouter, 
                                                                                //어떠한 route를 동작시킬건지 navTo(route명)
            },

            onNavToDetail : function(oEvent){
                var ReqNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
                this.getOwnerComponent().getRouter().navTo("OrderDetail",{ReqNum: ReqNum});
            },

            onDelete : async function(){
                var model=this.getView().getModel("RequestModel");
                var i;
                for(i=0;i<totalNumber;i++){
                    var chk='/'+i+'/CHK'
                    if(model.getProperty(chk)===true){
                        var key='/'+i+'/request_number'
                        var request_number=model.getProperty(key);
                        console.log(request_number);
                        var url="/request/Request/"+request_number;
                        await $.ajax({
                            type:"delete",
                            url:url,
                            contentType: "application/json;IEEE754Compatible=true"
                        });
                    }
                }
                this.onDataView();
            },
            checkTest : function(){
                var checked=this.getView().byId("AllChk").getSelected();
                if(checked) {this.checkmode(true);}
                else{
                    this.checkmode(false);
                }
            },
            checkmode : function(data){
                var model = this.getView().getModel("RequestModel");
                for(var i=0;i<totalNumber;i++){
                    var request_state='/'+i+'/request_state'
                    if(model.getProperty(request_state)==='B'){
                        var key='/'+i+'/CHK'
                        var request_number=model.setProperty(key,data);
                    }
                }
            },

            onDataExport : function(){
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                oTable = this.byId("RequestTable");
                oRowBinding=oTable.getBinding("rows");
                console.log(oRowBinding.oList);
                aCols=this.createColumnConfig();
                var oList=[];
                for(var j=0;j<oRowBinding.oList.length;j++){
                    if(oRowBinding.aIndices.indexOf(j)>-1){
                        oList.push(oRowBinding.oList[j]);

                        // var temp={
                        //     request_state: oRowBinding.oList[j].request_state
                        // }
                        // oList.push(temp);
                    }
                }
                for(var i=0;i<oList.length;i++){
                    if(oList[i].request_state==='A'){
                        oList[i].request_state2='승인';
                    }
                    if(oList[i].request_state==='B'){
                        oList[i].request_state2='처리 대기';
                    }
                    if(oList[i].request_state==='C'){
                        oList[i].request_state2='반려';
                    }
                }

                oSettings={
                    workbook:{
                        columns:aCols,
                        hierarchyLevel:'Level'
                    },
                    dataSource:oList,
                    fileName:'RequestTable.xlsx',
                    worker:false
                };
                oSheet=new Spreadsheet(oSettings);
                oSheet.build().finally(function(){
                    oSheet.destroy();
                });
            },

            createColumnConfig : function(){
                const aCols=[];
                aCols.push({
                    label: '요청 번호',
                    property:'request_number',
                    type:EdmType.String
                });
                aCols.push({
                    label: '요청 물품',
                    property:'request_product',
                    type:EdmType.String
                });
                aCols.push({
                    label: '물품 개수',
                    property:'request_quantity',
                    type:EdmType.Int32
                });
                aCols.push({
                    label: '요청자',
                    property:'requestor',
                    type:EdmType.String
                });
                aCols.push({
                    label: '요청 일자',
                    property:'request_date',
                    type:EdmType.String
                });
                aCols.push({
                    label: '처리 상태',
                    property:'request_state2',
                    type:EdmType.String
                });
                return aCols;
            }
    });
});