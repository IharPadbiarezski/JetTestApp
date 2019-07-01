import {JetView} from "webix-jet";
// import {activitytypes} from "../../models/activitytypesdata";
import {files} from "../models/files";

export default class FilesDataTable extends JetView{
	config(){
		return {
			id: "contact:files",
			rows: [
				// {
				// 	view:"list",  id:"mylist", type:"uploader",
				// 	autoheight:true, borderless:true	
				//   },
				{
					view:"datatable",
					localId: "datatable",
					type:"uploader",
					select: true,
					columns: [
						{ 
							id: "name",
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
							id: "size",
							header: "Size",
							fillspace: true,
							sort: "string"
						},
						// {
						// 	id: "",
						// 	template: (obj) => obj.cancel,
						// 	width: 60
						// },
					],
					// onClick: {
					// 	"wxi-trash":(e, id) => {
					// 		webix.confirm({
					// 			text: "The file will be deleted. Deleting cannot be undone... <br/> Are you sure?"
					// 		}).then( res => {
					// 			if (res)
					// 				this.app.callEvent("activities:delete",[id.row]);
					// 		});
					// 		return false;
					// 	}
					// }
				},
				{
					view:"uploader",
					id: "uploader_1",
					value:"Upload file",
					icon: "wxi-plus",
					// link:"datatable",
					upload: files
					// datatype:"json"
				}
			]
		};
	}
	
	init(){
		// this.$$("datatable").sync(files)
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