sap.ui.define([],function(){
    "use strict";
    return {
        statusText: function (sStatus){
            switch(sStatus){
                case "trust":
                    return "신뢰";
                case "hold":
                    return "보류";
                case "caution":
                    return "주의";
                default:
                    return sStatus;
            }
        }
    };
});