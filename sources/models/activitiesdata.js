const dateFormat = webix.Date.strToDate("%d-%m-%Y %h:%i");

export const activities = new webix.DataCollection({
	scheme:{
		$init: (obj)=>{
			obj.DueDate = dateFormat(obj.DueDate);
		},
	},
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/"
});