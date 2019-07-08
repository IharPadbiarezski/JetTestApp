import {JetView} from "webix-jet";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";
import {activities} from "../../models/activitiesdata";
import {icons} from "../../models/icons";

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
					template: (obj, common, value, config) => {
						// const type = config.collection.data.find(c => parseInt(c.id) === parseInt(value))[0];
						// return `<span class='mdi mdi-${type.Icon}'></span> ${type.value}`;
						// obj.Value;
						// console.log(obj);
						// console.log(common);
						// console.log(value);
						// const type = 
						// console.log(value);
						// let values = webix.copy(contacts.getItem(id));
						// values.status = statuses.getItem(values.StatusID).Value;

						const type = config.collection.data.find(item => item.id === value)[0];
						
						const icon = icons.getItem(type.Icon).Value;
						
						// const type = config.collection.data.find(c => parseInt(c.id) === parseInt(value))[0];
						return `<span class='webix_icon wxi-${icon}'></span> ${type.value}`;
						// return `<span class='webix_icon ${obj.icon}'></span> ${_(obj.value)}`
						// console.log(obj.TypeID);
					},
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
						text: _("The activity will be deleted. Deleting cannot be undone... <br/> Are you sure?"),
						ok: _("OK"),
						cancel: _("Cancel")
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
		view.sync(activities);
		activities.waitData.then(() => {
			activities.data.filter();
		});
	}

	setDisable() {
		const comboContact = webix.$$("comboContact:activity");
		let url = this.getUrlString();
		if (url.includes("contactinfo")) {
			comboContact.disable();
		}
	}
}