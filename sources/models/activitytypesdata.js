export const activitytypes = new webix.DataCollection({
	scheme:{
		$init: obj => obj.value = obj.Value
	},
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/"
});