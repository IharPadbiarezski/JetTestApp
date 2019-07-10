import {JetView} from "webix-jet";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";
import {activities} from "../../models/activitiesdata";
import {icons} from "../../models/icons";

export default class ActivitiesDataTable extends JetView {
	constructor(app, name, flag) {
		super(app, name);
		this.flag = flag;
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "datatable",
			localId: "activities",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					width: 40,
					checkValue: "Close",
					uncheckValue: "Open",
					sort: "string"
				},
				{
					id: "TypeID",
					header: [_("Activity type"), {content: "selectFilter"}],
					collection: activitytypes,
					fillspace: true,
					template: (obj, common, value, config) => {
						const type = config.collection.getItem(value);
						if (type) {
							const icon = icons.getItem(type.Icon);
							return (icon ? icon.value : "") + type.Value;
						}
						return "";
					},
					sort: "string"
				},
				{
					id: "ConvDueDate",
					header: [_("Due date"), {content: "datepickerFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}],
					fillspace: true,
					sort: "date",
					format: webix.i18n.longDateFormatStr
				},
				{
					id: "Details",
					header: [_("Details"), {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					header: [_("Contact"), {content: "selectFilter"}],
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
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: _("The activity will be deleted. Deleting cannot be undone... <br/> Are you sure?"),
						ok: _("OK"),
						cancel: _("Cancel")
					}).then((res) => {
						if (res) {
							this.app.callEvent("activities:delete", [id.row]);
						}
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("form:fill", [item, this.flag]);
				}
			},
			on: {
				onAfterFilter: () => {
					if (this.flag === "specific") {
						const id = this.getParam("id", true);
						this.getRoot().filter(obj => obj.ContactID.toString() === id.toString(), "", true);
					}
				}
			}
		};
	}

	init(view) {
		icons.waitData.then(() => {
			view.sync(activities, () => {
				view.filterByAll();
			});
		});
	}

	urlChange(view) {
		view.filterByAll();
	}
}
