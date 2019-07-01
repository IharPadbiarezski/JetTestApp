import {JetView} from "webix-jet";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";

export default class ActivitiesDataTable extends JetView{
	config(){
		return {
			view:"datatable",
			localId: "activities",
			id: "activities:datatable",
			select: true,
			columns: [
				{ id:"State", header:"", template:"{common.checkbox()}", width: 40, sort: "string"},
				{
					id: "TypeID",
					header: [ "Activity type", { content: "selectFilter" } ],
					collection: activitytypes,
					fillspace: true,
					sort: "string"
				},
				{ 
					id: "ConvDueDate",
					header: [ "Due date", { content:"datepickerFilter", inputConfig:{ format:webix.i18n.longDateFormatStr } } ],
					fillspace: true,
					sort: "date",
					format:webix.i18n.longDateFormatStr
				},
				{ 
					id: "Details",
					header: [ "Details", { content: "textFilter" } ],
					fillspace: true,
					sort: "string"
				},
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
			onClick: {
				"wxi-trash":(e, id) => {
					webix.confirm({
						text: "The activity will be deleted. Deleting cannot be undone... <br/> Are you sure?"
					}).then( res => {
						if (res)
							this.app.callEvent("activities:delete",[id.row]);
					});
					return false;
				},
				"wxi-pencil":(e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("form:fill", [item]);
				}
			}
		};	
	}
}