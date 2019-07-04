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
					invalidMessage: "Start Date must be less than current Date"
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
					view:"text",
					name:"Company",
					label:"Company",
					labelWidth: 90,
					placeholder:"Company",
					invalidMessage:"A company is required"
				},
				{
					view:"text",
					name:"Website",
					label:"Website",
					labelWidth: 90,
					placeholder:"Website",
					invalidMessage: "Website must look like https://webix.com"
				},
				{
					view:"text",
					name:"Address",
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
					invalidMessage:"Email is required"
				},
				{
					view:"text",
					name:"Skype",
					label:"Skype",
					labelWidth: 90,
					placeholder:"Skype",
					invalidMessage:"A skype is required (without spaces)"
				},
				{
					view: "text",
					name: "Phone",
					label: "Phone",
					labelWidth: 90,
					placeholder: "Phone",
					pattern: { mask: "###-## #######", allow:/[0-9]/g},
					invalidMessage: "Sorry, you must type any 12 numbers"
				},
				{
					view:"datepicker",
					name: "InfoBirthday",
					label: "Birthday",
					labelWidth: 90,
					invalidMessage: "Start Date must be less than current Date"
				}
			]
		};

		const contact_photo = {
			view: "template",
			name: "Photo",
			borderless: true,
			localId: "photo",
			template: obj =>  `
			        <image class="userphotoform" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
			    `
		};
        
		const photo_buttons = {
			margin:10,
			rows:[
				{},
				{ 
					view:"uploader",
					value:"Change photo",
					accept:"image/jpeg, image/png",       
					autosend:false, 
					multiple:false,
					on:{        
						onBeforeFileAdd: (upload) => {        
							var file = upload.file;
							var reader = new FileReader();  
							reader.onload = (event) => {
								this.photo = event.target.result;
								this.$$("photo").setValues({Photo: this.photo});
							};           
							reader.readAsDataURL(file);
							return false;
						}
					}
				},
				{
					view:"button",
					value:"Delete photo",
					tooltip:"Click to delete the photo",
					click: () => {
						this.photo = "";
						this.$$("photo").setValues({Photo: this.photo});
					}
				}
			]
		};
		
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
						if (this.form.validate()){
							this.addContact();
							this.getParentView().show("contactinfo", {target:"right"});
						}
					}
				}
			]
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
						FirstName: webix.rules.isNotEmpty,
						LastName: webix.rules.isNotEmpty,
						StartDate: (date) => {
							const currentDate = new Date();
							currentDate.getFullYear();
							if(webix.isDate(date) && date < currentDate){
								return true;
							}
						},
						StatusID: webix.rules.isNotEmpty,
						Job: webix.rules.isNotEmpty,
						Company: webix.rules.isNotEmpty,
						Website: (value) => {
							try {
								new URL(value);
								return true;
							} catch (_) {
								return false;  
							}
						},
						Address: webix.rules.isNotEmpty,
						Email: webix.rules.isEmail,
						Skype: (value) => {
							const regExp = /^[0-9a-zA-Z]+$/;
							return value.match(regExp);
						},
						InfoBirthday: (date) => {
							const currentDate = new Date();
							currentDate.getFullYear();
							if(webix.isDate(date) && date < currentDate){
								return true;
							}
						}
					}
				}
			]
		};
	}

	init() {
		this.form = this.$$("form");
		this.form.clear();
		this.contactList = this.getParentView().getRoot().queryView("list");
		const id = this.getParam("id", true);
		contacts.waitData.then(() => {
			if (id && contacts.exists(id)) {
				const photo = contacts.getItem(id).Photo;
				this.photo = photo;
			}
		});			
	}

	urlChange() {
		const id = this.getParam("id", true);
		if (id) {
			webix.promise.all([
				contacts.waitData,
				statuses.waitData
			]).then(() => {
				const values = contacts.getItem(id);
				const photo = this.$$("photo");
				if (values) {
					this.form.setValues(values);
					photo.setValues({Photo: values.Photo});
				}			
			});
		}
	}


	addContact() {
		const values = this.form.getValues();
		const id = values.id;
		this.newID = contacts.getLastId();
		if (contacts.exists(id)) {
			values.Photo = this.photo;
			contacts.updateItem(id, values);
			this.contactList.select(id);
		} else {
			values.Photo = this.photo;
			contacts.add(values);
			this.contactList.select(contacts.getLastId());
		}
	}

	closeForm() {
		const id = this.getParam("id", true);
		if (id) {
			this.contactList.select(id);
		} else {
			this.contactList.select(this.contactList.getFirstId());
		}
		this.getParentView().show("contactinfo", {target:"right"});
	}
}
