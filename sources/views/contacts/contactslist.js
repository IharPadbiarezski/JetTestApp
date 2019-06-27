import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";

export default class ContactsView extends JetView{
	config(){

		const add_button = {
			view: "button",
			label: "Add contact",
			localId: "add_button",
			type:"icon",
			value: "Add",
			icon: "wxi-plus",
			css: "webix_primary",
			align: "center",
			inputWidth: 200,
			click: () => {
				// const value = this.$$("add_button").getValue();
				// this.form.showForm({}, value);
				this.getParentView().show("contactform", {target:"right"});
			}
		};

		const contact_list = {
			view:"list",
			localId: "list",
			borderless: true,
			scroll: "auto",
			width:250,
			select:true,
			css: "persons_list",
			type:{
				template:obj => `
							<image class="contactphoto" src="${obj.Photo ? obj.Photo : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
							<div class="text">
								<span class="contactname">${obj.FirstName} ${obj.LastName}</span>
								<span class="contactjob">${obj.Job}</span>
							</div>
							`,
				height:66
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`../contacts?id=${id}`);
				}
			}
		};

		return {
			css:"bg_color",
			rows: [
				contact_list,
				{},
				add_button
			]
		};
	}
	init() {
		const list = this.$$("list");
		list.sync(contacts);

		contacts.waitData.then(() => {
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id) { list.select(id); }
		});
	}
}