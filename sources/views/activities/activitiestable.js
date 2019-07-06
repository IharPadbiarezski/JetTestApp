import {JetView} from "webix-jet";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";
import {activities} from "../../models/activitiesdata";

export default class ActivitiesDataTable extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		return {
			view:"datatable",
			localId: "activities",
			id: "activities:datatable",
			select: true,
			columns: [
				{ id:"State", header:"", template:"{common.checkbox()}", width: 40, sort: "string"},
				{
					id: "TypeID",
					header: [ _("Activity type"), { content: "selectFilter" } ],
					collection: activitytypes,
					fillspace: true,
					sort: "string"
				},
				{ 
					id: "ConvDueDate",
					header: [ _("Due date"), { content:"datepickerFilter", inputConfig:{ format:webix.i18n.longDateFormatStr } } ],
					fillspace: true,
					sort: "date",
					format:webix.i18n.longDateFormatStr
				},
				{ 
					id: "Details",
					header: [ _("Details"), { content: "textFilter" } ],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					header: [ _("Contact"), { content: "selectFilter" } ],
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
						text: _("The activity will be deleted. Deleting cannot be undone... <br/> Are you sure?")
					}).then( res => {
						if (res)
							this.app.callEvent("activities:delete",[id.row]);
					});
					return false;
				},
				"wxi-pencil":(e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("form:fill", [item]);
					this.setDisable();
				}
			}
		};	
	}

	init(view) {
		activities.data.filter();
		view.sync(activities);
	}
	setDisable() {
		const comboContact = webix.$$("comboContact:activity");
		let url = this.getUrlString();
		if (url.includes("contactinfo")) {
			comboContact.disable();
		}
	}
}