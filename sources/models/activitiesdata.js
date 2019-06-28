const dateFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");
const strFormatDate = webix.Date.dateToStr("%Y-%m-%d");
const strFormatTime = webix.Date.dateToStr("%H:%i");

export const activities = new webix.DataCollection({
	scheme:{
		$init: (obj) => {
			obj.ConvDueDate = new Date(dateFormat(obj.DueDate));
			obj.ConvDueTime = new Date(obj.ConvDueDate);
		},
		$save: (obj) => {
			obj.DueDate =`${strFormatDate(obj.ConvDueDate)} ${strFormatTime(obj.ConvDueTime)}`;
		}
	},
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/"
});