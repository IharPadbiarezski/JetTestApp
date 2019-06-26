const my_format = webix.Date.strToDate("%d-%m-%Y %h:%i ");

export const contacts = new webix.DataCollection({
	scheme:{
		$init:function(obj){ obj.value = `${obj.FirstName} ${obj.LastName}` ; 
			// obj.DueDate = my_format(obj.DueDate);
		}
	},
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/"
});
