export const contacts = new webix.DataCollection({
	scheme:{
		$init:function(obj){ obj.value = `${obj.FirstName} ${obj.LastName}` ; }
	},
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/"
});