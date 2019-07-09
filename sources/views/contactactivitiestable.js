import {JetView} from "webix-jet";
import {activities} from "../models/activitiesdata";
import ActivitiesDataTable from "./activities/activitiestable";
import ActivityWindow from "./activities/activityform";

export default class ContactActivitiesTable extends JetView{
	config(){
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{ $subview: new ActivitiesDataTable(this.app, "", "specific") },
				{	
					view:"toolbar", css:"subbar", padding:0,
					elements:[
						{},
						{
							view: "button",
							label: _("Add"),
							localId: "addButton",
							type:"icon",
							value: "Add",
							icon: "wxi-plus",
							css: "webix_primary",
							align: "right",
							inputWidth: 200,
							click: () => {
								const id = this.getParam("id", true);
								const value = this.$$("addButton").getValue();
								const title = {head: _(`${value} new`), button: _(value)};
								this.form.showActivityForm({ContactID: id}, title, true);
							}
						}
					]
				},
			]
		};
	}

	init() {

		this.form = this.ui(ActivityWindow);

		this.on(this.app, "activities:save", values => {
			values.id ? activities.updateItem(values.id, values) : activities.add(values);
		});

		this.on(this.app,"activities:delete", id => activities.remove(id));
	}
}