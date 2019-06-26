import {JetView} from "webix-jet";
import {activities} from "../../models/activitiesdata";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";

export default class ActivitiesDataTable extends JetView{
	config(){
		return {
			view:"datatable",
			localId: "activities",
			select: true,
			columns: [
				{ id:"State", header:"", template:"{common.checkbox()}", sort: "int"},
				{
					id: "TypeID",
					header: [ "Activity type", { content: "selectFilter" } ],
					collection: activitytypes,
					fillspace: true,
					sort: "string"
				},
				{ 
					//format:webix.i18n.longDateFormatStr, 
					// map:"(date)#DueDate#" 
					map:"(date)#DueDate#", id: "DueDate", format:webix.i18n.longDateFormatStr, header: [ "Due date", { content:"datepickerFilter" } ], fillspace: true, sort: "date"},
				{ id: "Details", header: [ "Details", { content: "textFilter" } ], fillspace: true, sort: "string" },
				{
					id: "ContactID",
					header: [ "Contact", { content: "selectFilter" } ],
					collection: contacts,
					fillspace: true,
					sort: "string"
				},
				{
					id: "",
					template: "{common.editIcon()}",
					width: 60
				},
				{
					id: "",
					template: "{common.trashIcon()}",
					width: 60
				},
			],
			on: {
				onAfterSelect: (id) => {
					this.show(`../activities?id=${id}`);
				}
			},
			onClick: {
				"wxi-trash":(e, id) => {
					webix.confirm({
						text:"The activity will be deleted. Deleting cannot be undone... <br/> Are you sure?",
						ok:"Yes", cancel:"Cancel",
						callback: res => {
							if (res)
								this.app.callEvent("activities:delete",[id.row]);
						}
					});
				},
				"wxi-pencil":(e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("form:fill", [item]);
				}
			}
		};
	}
	
	init(view){
		view.sync(activities);
	}

	urlChange() {
		webix.promise.all([
			activities.waitData,
			activitytypes.waitData,
			contacts.waitData
		]).then(() => {
			let activitiesTable = this.$$("activities");
			let id = this.getParam("id");
			if (id && activities.exists(id)) { activitiesTable.select(id); }
		});
	}
}