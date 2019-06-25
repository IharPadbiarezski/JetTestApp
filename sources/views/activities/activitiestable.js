import {JetView} from "webix-jet";
import {activities} from "../../models/activitiesdata";
import {activitytypes} from "../../models/activitytypesdata";
import {contacts} from "../../models/contactsdata";

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
				select: true,
				columns: [
					{ id:"ch1", header:"", template:"{common.checkbox()}"},
					{
						id: "TypeID",
						header: [ "Activity type", { content: "selectFilter" } ],
						options: activityTypes,
						fillspace: true,
						sort: "string"
					},
					{ format:webix.i18n.longDateFormatStr, id: "DueDate", header: [ "Due date", { content: "dateFilter" } ], fillspace: true, sort: "date"},
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
				scheme:{
					name:"Unknown",
					age:16
				}
			};
		});
	}
	
	init(view){
		view.sync(activities);
	}
}