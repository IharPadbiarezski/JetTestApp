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
						const mode = this.getParam("mode", true);
						if (mode === "Add") {
							this.app.callEvent("firstcontact:select");
						} else {
							let id = this.getParam("id", true);
							this.app.callEvent("contactinfo:show", [id, mode]);
						}
					},
					tooltip:"Click to close the form"
				},
				{
					view:"button",
					localId: "saveButton",
					type:"form",
					width: 200,
					tooltip:"Save changes",
					click:() => {
						if (this.form.validate()){
							const values = this.form.getValues();
							values.Photo = this.photo;
							const id = values.id;
							const mode = this.getParam("mode", true);
							contacts.waitSave(() => {
								if (id) {
									contacts.updateItem(id, values);
								} else {
									contacts.add(values);
								}
							}).then((item) => {
								this.app.callEvent("contactinfo:show", [item.id, mode]);
							});
							
						}
					}
				}
			]
		};

		return {
			rows: [
				{
					type:"header",
					localId: "headerForm",
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
				
				const mode = this.getParam("mode", true);

				if (mode) {
					this.$$("headerForm").setValues({value: `${mode} contact`});

					if (mode === "Add") {
						this.photo = "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png";
						this.$$("photo").setValues({Photo: this.photo});
						this.$$("form").clear();
						this.$$("saveButton").setValue(mode);
					}
					if (mode === "Edit") {
						this.$$("saveButton").setValue("Save");
					}
				}
			});
		}
	}
}
