export const activitytypes = new webix.DataCollection({
	scheme: {
		$change: (obj) => { obj.value = obj.Value; },
		$save: (obj) => {
			obj.Value = obj.value;
		}
	},
	url: "http://localhost:8096/api/v1/activitytypes/",
	save: "rest->http://localhost:8096/api/v1/activitytypes/"
});
