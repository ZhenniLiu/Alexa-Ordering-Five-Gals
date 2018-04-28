'use strict';
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event, context, callback) {

    var params = {
            TableName: 'Orders',
            FilterExpression: "#itemid between :start_id and :end_id",
            ExpressionAttributeNames:{
            "#itemid" : "itemid"
            },
            ExpressionAttributeValues: {
            ":start_id" : 0,
            ":end_id" : 50
            }
    };

    docClient.scan(params, function(err, data){
        if(err){
            callback(err, null);
        }else{
            callback(null, data);
        }
    });
};
