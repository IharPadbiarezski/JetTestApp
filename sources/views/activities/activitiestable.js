import {JetView} from "webix-jet";
import {activities} from "../../models/activitiesdata";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";
import ActivityForm from "../activities/activityform";

export default class ActivitiesDataTable extends JetView{
	config(){
		return webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			let activityTypes = [];
			for(let val in activitytypes.data.pull){
				activityTypes.push({id:activitytypes.data.pull[val].id, value:activitytypes.data.pull[val].Value});
			}

			let contactNames = [];
			for(let val in contacts.data.pull){
				contactNames.push({id:contacts.data.pull[val].id, value: `${contacts.data.pull[val].FirstName} ${contacts.data.pull[val].LastName}`});
			}

			return {
				view:"datatable",
				localId: "activities",
				select: true,
				columns: [
					{ id:"checkbox", header:"", template:"{common.checkbox()}", sort: "string"},
					{
						id: "TypeID",
						header: [ "Activity type", { content: "selectFilter" } ],
						options: activityTypes,
						fillspace: true,
						sort: "string"
					},
					{ format:webix.i18n.longDateFormatStr, id: "DueDate", header: [ "Due date", { content:"datepickerFilter" } ], fillspace: true, sort: "date"},
					{ id: "Details", header: [ "Details", { content: "textFilter" } ], fillspace: true, sort: "string" },
					{
						id: "ContactID",
						header: [ "Contact", { content: "selectFilter" } ],
						collection: contactNames,
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
				// scheme:{
				// 	name:"Unknown",
				// 	age:16
				// },
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
		});
	}
	
	init(view){
		view.sync(activities);
		this.form = this.ui(ActivityForm);
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