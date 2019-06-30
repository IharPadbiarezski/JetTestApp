import {JetView} from "webix-jet";
// import {activitytypes} from "../../models/activitytypesdata";
// import {contacts} from "../../models/contactsdata";

export default class FilesDataTable extends JetView{
	config(){
		return {
			view:"datatable",
			localId: "datatable",
			id: "contact:files",
			select: true,
			columns: [
				{ 
					id: "Name",
					header: "Name",
					fillspace: true,
					sort: "string"
				},
				{ 
					id: "ChangeDate",
					header: "Change date",
					fillspace: true,
					sort: "date",
					format:webix.i18n.longDateFormatStr
				},
				{ 
					id: "Size",
					header: "Size",
					fillspace: true,
					sort: "string"
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
				}
			}
		};
	}
	
	init(view){
        // view.sync(activities);
        view.parse([{"Name": "New File", "ChangeData": "12-12-2020 11:00", "Size": "12kb"}, {"Name": "New File2", "ChangeData": "12-12-2010 11:00", "Size": "16kb"}])
	}

	// urlChange() {
	// 	webix.promise.all([
	// 		activities.waitData,
	// 		activitytypes.waitData,
	// 		contacts.waitData
	// 	]).then(() => {
	// 		const activitiesTable = this.$$("activities");
	// 		const id = this.getParam("id");
	// 		const selectedId = activitiesTable.getSelectedId().id;
	// 		if (id && activities.exists(id) && id !== selectedId) {
	// 			activitiesTable.select(id);
	// 		}
	// 	});
	// }
}