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
					placeholder:"First name",
					invalidMessage:"A name is required"
				},
				{
					view:"text", name:"LastName",
					label:"Last name",
					placeholder:"Last name"
				},
				{
					view:"datepicker",
					name: "StartDate",
					label: "Joining date",
					invalidMessage: "Please select a date"
				},
				{
					view: "combo",
					name: "StatusID",
					label: "Status",
					options: statuses,
					invalidMessage: "Please select a status"
				},
				{
					view:"text", name:"Job",
					label:"Job",
					placeholder:"Job position"
				},
				{
					view:"text", name:"Company",
					label:"Company",
					placeholder:"Company"
				},
				{
					view:"text", name:"Website",
					label:"Website",
					placeholder:"Website"
				},
				{
					view:"text", name:"Address",
					label:"Address",
					placeholder:"Address"
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
					placeholder:"Email",
				},
				{
					view:"text",
					name:"Skype",
					label:"Skype",
					placeholder:"Skype"
				},
				{
					view:"text",
					name:"Phone",
					label:"Phone",
					placeholder:"Phone"
				},
                
			]
		};

		
        
		const buttons = {
			margin:10,
			cols:[
				{},
				{
					view:"button", value:"Save (*add)", type:"form", autowidth:true,
					tooltip:"Save changes",
					// click:() => {
					// 	if (this.$$("form").validate()){
					// 	}
					// }
				},
				{
					view:"button", value:"Cancel", autowidth:true,
					click:() => {
						// this.$$("form").clear();
						this.getParentView().show("contactinfo", {target:"right"});
					},
					tooltip:"Click to close the form"
				}
			]
		};

		const contact_photo = {
			view: "template",
			borderless: true,
			localId: "photo",
			template: obj =>  `
                    <image class="userphoto" src="${obj.Photo ? obj.Photo : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                `
		};
        
		const photo_buttons = {
			margin:10,
			rows:[
				{},
				{
					view:"button", value:"Change photo", type:"form", autowidth:true,
					tooltip:"Click to change the photo",
				},
				{
					view:"button", value:"Delete photo", autowidth:true,
					click:() => {
					},
					tooltip:"Click to delete the photo"
				}
			]
		};



		return {
			rows: [
				{
					type:"header",
					localId: "header_contactform",
					template: "Edit (*add new) Contact",
					// template: obj => obj.value,
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
						$all: webix.rules.isNotEmpty
					}
				}
			]
		};
	}

	urlChange() {
		let form = this.$$("form");
		const id = this.getParentView().getSelected();
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const values = contacts.getItem(id);
			if (values) { form.setValues(values); }
		});
	}
}
