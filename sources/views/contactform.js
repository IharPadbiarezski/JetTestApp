import {JetView} from "webix-jet";
import {statuses} from "../models/statusesdata";
import {contacts} from "../models/contactsdata";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const main_info = {
			margin:10,
			rows:[
				{
					view: "text",
					name: "FirstName",
					label: _("First name"),
					labelWidth: 90,
					placeholder: _("First name"),
					invalidMessage: _("A first name is required")
				},
				{
					view: "text",
					name: "LastName",
					label: _("Last name"),
					labelWidth: 90,
					placeholder: _("Last name"),
					invalidMessage: _("A last name is required")
				},
				{
					view:"datepicker",
					name: "StartDate",
					label: _("Joining date"),
					labelWidth: 90,
					invalidMessage: _("Start Date must be less than current Date")
				},
				{
					view: "combo",
					name: "StatusID",
					label: _("Status"),
					labelWidth: 90,
					options: statuses,
					invalidMessage: _("Please select a status")
				},
				{
					view: "text",
					name: "Job",
					label: _("Job"),
					labelWidth: 90,
					placeholder: _("Job position"),
					invalidMessage: _("A job position is required")
				},
				{
					view: "text",
					name: "Company",
					label: _("Company"),
					labelWidth: 90,
					placeholder: _("Company"),
					invalidMessage: _("A company is required")
				},
				{
					view: "text",
					name: "Website",
					label: _("Website"),
					labelWidth: 90,
					placeholder: _("Website"),
					invalidMessage: _("Website must look like https://webix.com")
				},
				{
					view: "text",
					name: "Address",
					label: _("Address"),
					labelWidth: 90,
					placeholder: _("Address"),
					invalidMessage: _("An address is required")
				}
			]
		};

		const more_info = {
			margin:10,
			rows: [
				{
					view: "text",
					name: "Email",
					label: _("Email"),
					labelWidth: 90,
					placeholder: _("Email"),
					invalidMessage: _("Email is required")
				},
				{
					view: "text",
					name: "Skype",
					label: _("Skype"),
					labelWidth: 90,
					placeholder: _("Skype"),
					invalidMessage: _("A skype is required (without spaces)")
				},
				{
					view: "text",
					name: "Phone",
					label: _("Phone"),
					labelWidth: 90,
					placeholder: _("Phone"),
					pattern: { mask: "###-## #######", allow:/[0-9]/g},
					invalidMessage: _("Sorry, you must type any 12 numbers")
				},
				{
					view:"datepicker",
					name: "InfoBirthday",
					label: _("Birthday"),
					labelWidth: 90,
					invalidMessage: _("Start Date must be less than current Date")
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
					view: "uploader",
					value: _("Change photo"),
					accept: "image/jpeg, image/png",
					autosend: false,
					multiple: false,
					on:{        
						onBeforeFileAdd: (upload) => {        
							var file = upload.file;
							var reader = new FileReader();  
							reader.onload = (event) => {
								const photo = event.target.result;
								this.$$("photo").setValues({Photo: photo});
							};           
							reader.readAsDataURL(file);
							return false;
						}
					}
				},
				{
					view: "button",
					value: _("Delete photo"),
					tooltip: _("Click to delete the photo"),
					click: () => {
						this.$$("photo").setValues({Photo: ""});
					}
				}
			]
		};
		
		const buttons = {
			margin:10,
			cols:[
				{},
				{
					view: "button",
					value: _("Cancel"),
					width: 200,
					click:() => {
						const id = this.getParam("id", true);
						this.app.callEvent("contactinfo:show", [id]);
					},
					tooltip: _("Click to close the form")
				},
				{
					view:"button",
					localId: "saveButton",
					type:"form",
					width: 200,
					tooltip: _("Save changes"),
					click:() => {
						if (this.form.validate()){
							const values = this.form.getValues();
							const photo = this.$$("photo").getValues().Photo;
							values.Photo = photo;
							const id = values.id;
							contacts.waitSave(() => {
								if (id) {
									contacts.updateItem(id, values);
								} else {
									contacts.add(values);

								}
							}).then((item) => {
								this.app.callEvent("contactinfo:show", [item.id]);
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
	}

	urlChange() {
		const _ = this.app.getService("locale")._;
		const id = this.getParam("id", true);
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
			if (!id) {
				const name = _("Add");
				this.$$("headerForm").setValues({value: `${name} ${_("contact")}`});
				this.$$("form").clear();
				this.$$("saveButton").setValue(name);
			} else {
				this.$$("headerForm").setValues({value: _("Edit contact")});
				this.$$("saveButton").setValue(_("Save"));
			}
		});
	}
}
