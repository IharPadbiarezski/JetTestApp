import {JetView} from "webix-jet";
import {contacts} from "../models/contactsdata";
import {files} from "../models/files";

export default class FilesDataTable extends JetView{
	config(){
		return {
			id: "contact:files",
			rows: [
				{
					view:"datatable",
					localId: "datatable",
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
							sort: "int"
						},
						{
							id: "",
							template: "{common.trashIcon()}",
							width: 60
						}
					
					],
					onClick: {
						"wxi-trash":(e, id) => {
							webix.confirm({
								text: "The file will be deleted. Deleting cannot be undone... <br/> Are you sure?"
							}).then(() => {
								if (id)
									files.remove(id);
							});
							return false;
						}
					}
				},
				{ cols: [
					{},
					{
						view:"uploader",
						id: "uploader",
						type:"iconButton",
						icon:"mdi mdi-upload",
						label:"Upload file",
						width: 200
					},
					{}
				]
				}
			]
		};
	}
	
	init(view){
		view.queryView("datatable").sync(files);
		files.add({name: "hi", ContactID: 2, size: "4551"});
		files.add({name: "hi2", ContactID: 2, size: "4525"});
		files.add({name: "hi3", ContactID: 3, size: "4554"});
			
	}
	
	urlChange() {
		

		contacts.waitData.then(() => {
			const id = this.getParam("id", true);
			files.data.filter(file => file.ContactID == id);


		});
	}
}
