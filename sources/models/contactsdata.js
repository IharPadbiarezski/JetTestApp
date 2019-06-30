const dateFormat = webix.Date.strToDate("%d-%m-%Y");
const strFormatDate = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const contacts = new webix.DataCollection({
	scheme:{
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.StartDate = dateFormat(obj.StartDate);
			if (!obj.InfoBirthday) {
				obj.InfoBirthday = dateFormat(obj.Birthday);
			}
		},
		$save: (obj) => {
			obj.StartDate = strFormatDate(obj.StartDate);
			obj.Birthday = strFormatDate(obj.InfoBirthday);
		}
	},
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/"
});
