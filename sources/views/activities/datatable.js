import {JetView} from "webix-jet";
import {activities} from "../../models/activitiesdata";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";

export default class DataTable extends JetView{
	config(){
		return webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			return {
				view:"datatable",
				select: true,
				columns: [
					{ id:"ch1", header:"", template:"{common.checkbox()}"},
					{
						id: "TypeID",
						header: [ "Activity type", { content: "selectFilter" } ],
						collection: {body: {
							data: activitytypes, template: "#Value#"}},
						fillspace: true,
						sort: "string"
					},
					{  map:"(date)#createdDate#", id: "DueDate", header: [ "Due date", { content: "dateFilter" } ], fillspace: true, sort: "date"},
					{ id: "Details", header: [ "Details", { content: "textFilter" } ], fillspace: true, sort: "string" },
					{
						id: "ContactID",
						header: [ "Contact", { content: "selectFilter" } ],
						collection: {body: {
							data: contacts, template: "#FirstName# #LastName"}},
						sort: "string"
					},
					{
						id: "",
						template: "<span class='webix_icon wxi-pencil style_icon'></span>",
						css: "editbtn",
						width: 100
					},
					{
						id: "",
						template: "<span class='webix_icon wxi-trash style_icon'></span>",
						css: "delbtn",
						width: 100
					}
				],
			};
		});
	}
	
	init(view){
		view.sync(activities);
	}
}