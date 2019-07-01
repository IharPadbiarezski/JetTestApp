import {JetView} from "webix-jet";
import {statuses} from "../models/statusesdata";
import {contacts} from "../models/contactsdata";

export default class ContactForm extends JetView {
	config() {

		const main_info = {
			margin:10,
			rows:[
				{
					view:"text", name:"FirstName",
					label:"First name",
					labelWidth: 90,
					placeholder:"First name",
					invalidMessage:"A first name is required"
				},
				{
					view:"text", name:"LastName",
					label:"Last name",
					labelWidth: 90,
					placeholder:"Last name",
					invalidMessage:"A last name is required"
				},
				{
					view:"datepicker",
					name: "StartDate",
					label: "Joining date",
					labelWidth: 90,
					invalidMessage: "Please select a date"
				},
				{
					view: "combo",
					name: "StatusID",
					label: "Status",
					labelWidth: 90,
					options: statuses,
					invalidMessage: "Please select a status"
				},
				{
					view:"text",
					name:"Job",
					label:"Job",
					labelWidth: 90,
					placeholder:"Job position",
					invalidMessage:"A job position is required"
				},
				{
					view:"text", name:"Company",
					label:"Company",
					labelWidth: 90,
					placeholder:"Company",
					invalidMessage:"A company is required"
				},
				{
					view:"text", name:"Website",
					label:"Website",
					labelWidth: 90,
					placeholder:"Website",
					invalidMessage:"A website is required"
				},
				{
					view:"text", name:"Address",
					label:"Address",
					labelWidth: 90,
					placeholder:"Address",
					invalidMessage:"An address is required"
				}
			]
		};

		const more_info = {
			margin:10,
			rows: [
				{
					view:"text",
					name:"Email",
					label:"Email",
					labelWidth: 90,
					placeholder:"Email",
					invalidMessage:"Ivalid Email"
				},
				{
					view:"text",
					name:"Skype",
					label:"Skype",
					labelWidth: 90,
					placeholder:"Skype",
					invalidMessage:"A skype is required"
				},
				{
					view:"text",
					name:"Phone",
					label:"Phone",
					labelWidth: 90,
					placeholder:"Phone",
					invalidMessage:"A phone is required"
				},
				{
					view:"datepicker",
					name: "InfoBirthday",
					label: "Birthday",
					labelWidth: 90,
					invalidMessage: "Please select a date"
				}
			]
		};

		const contact_photo = {
			// view: "template",
			// borderless: true,
			// localId: "photo",
			// template: obj =>  `
			//         <image class="userphotoform" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
			//     `
			
			view:"window",
			id:"tmpWin", 
			position:"center",
			head:"Preview", 
			close:true,
			body:{ 
				id:"tmp", 
				view:"template",
				template:"<img src='#src#' class='fit_parent'></img>",
				width:500,
				autoheight:true
			}
			
		};
        
		const photo_buttons = {
			margin:10,
			rows:[
				{},
				// {
				// 	view:"button",
				// 	value:"Change photo",
				// 	type:"form",
				// 	tooltip:"Click to change the photo",
				// 	click: () => {
				// 		// this.$$("uploadAPI").fileDialog({ id });
				// 	}
				// },
				{ 
					view:"uploader", 
					value:"Change photo",
					accept:"image/jpeg, image/png",       
					autosend:false, 
					multiple:false,
					on:{        
						onBeforeFileAdd: function(upload){        
							var file = upload.file;
							var reader = new FileReader();  
							reader.onload = function(event) {
								// console.log(event.target.result);
								webix.$$("tmpWin").getBody().setValues({src:event.target.result});
								webix.$$("tmpWin").show();
							};           
							reader.readAsDataURL(file);
							return false;
						}
					}
				},
				{
					view:"button",
					value:"Delete photo",
					click: () => {
						const id = this.getParentView().getSelected();
						if (id && contacts.exists(id)) {
							const values = contacts.getItem(id);
							values.Photo = "";
						}
					},
					tooltip:"Click to delete the photo"
				}
			]
		};

		// let uploadAPI = {
		// 	localId:"uploadAPI",
		// 	view:"uploader",
		// 	upload:"//docs.webix.com/samples/server/upload",
		// 	on:{
		// 		onBeforeFileAdd:function(item){
		// 			var type = item.type.toLowerCase();
		// 			if (type != "jpg" && type != "png"){
		// 				webix.message("Only PNG or JPG images are supported");
		// 				return false;
		// 			}
		// 		},
		// 		onFileUpload:function(item){
		// 			var id = item.context.rowid;
		// 			var row = $$("people").getItem(id);
		
		// 			row.photo = item.sname;
		// 			$$("people").updateItem(id, row);
		// 		},
		// 		onFileUploadError:function(item){
		// 			webix.alert("Error during file upload");
		// 		}
		// 	},
		// 	apiOnly:true
		// };

		
		const buttons = {
			margin:10,
			cols:[
				{},
				{
					view:"button",
					value:"Cancel",
					width: 200,
					click:() => {
						this.closeForm();
					},
					tooltip:"Click to close the form"
				},
				{
					view:"button",
					id: "save:contactform",
					type:"form",
					width: 200,
					tooltip:"Save changes",
					click:() => {
						// if (this.form.validate()){
						this.addContact();
						this.getParentView().show("contactinfo", {target:"right"});
						// }
					}
				}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				StartDay: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty,
				Job: webix.rules.isNotEmpty,
				Company: webix.rules.isNotEmpty,
				Website: webix.rules.isNotEmpty,
				Address: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail,
				Phone: webix.rules.isNotEmpty,
				Birthday: webix.rules.isNotEmpty
			}
		};

		return {
			rows: [
				{
					type:"header",
					localId: "header_contactform",
					id: "header:contactform",
					template: obj => obj.value,
					css:"webix_header"
				},
				{
					view: "form",
					localId: "form",
					id: "contact:form",
					rows: [
						{   margin:10,
							cols: [
								main_info,
								{
									margin: 10,
									rows: [
										more_info,
										{
											margin: 10,
											cols: [
												contact_photo,
												photo_buttons
											]
										}
										
									]
								}
							]
						},
						{},
						buttons
					],
					rules: {
						$all: webix.rules.isNotEmpty
					}
				}
			]
		};
	}

	init() {
		this.contactList = webix.$$("contacts:list");
		this.form = this.$$("form");
	}

	urlChange() {
		const id = this.getParentView().getSelected();
		if (id) {
			webix.promise.all([
				contacts.waitData,
				statuses.waitData
			]).then(() => {
				const values = contacts.getItem(id);
				if (values) { this.form.setValues(values); }
			});
		}
	}

	addContact() {
		const values = this.form.getValues();
		this.newID = values.id;
		if (contacts.exists(this.newID)) {
			contacts.updateItem(this.newID, values);
			this.contactList.select(this.newID);
		}
		else {
			contacts.add(values);
			this.contactList.select(contacts.getLastId());
		}
	}

	closeForm() {
		const id = this.getParentView().getSelected();
		if (id) {
			this.contactList.select(id);
		} else {
			this.contactList.select(this.contactList.getFirstId());
		}
		this.getParentView().show("contactinfo", {target:"right"});
	}
}
