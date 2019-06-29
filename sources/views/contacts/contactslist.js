import {JetView} from "webix-jet";
import {contacts} from "../../models/contactsdata";

export default class ContactsView extends JetView{
	config(){

		const add_button = {
			view: "button",
			label: "Add contact",
			localId: "add_button",
			autoheight: true,
			type:"icon",
			value: "Add",
			icon: "wxi-plus",
			css: "webix_primary",
			align: "center",
			inputWidth: 200,
			click: () => {		
				this.list.unselect();
				this.show("../contacts");
				this.getParentView().showForm({}, "Add new", "Add");
			}
		};

		const contact_list = {
			view:"list",
			localId: "list",
			id: "contacts:list",
			borderless: true,
			scroll: "auto",
			width:250,
			select:true,
			css: "persons_list",
			type:{
				template:obj => `
<<<<<<< HEAD
							<image class="contactphoto" src="${obj.Photo ? obj.Photo : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
							<div class="text">
								<span class="contactname">${obj.FirstName} ${obj.LastName}</span>
								<span class="contactjob">${obj.Job}</span>
							</div>
							`,
=======
                <image class="contactphoto" src="${obj.Photo || "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"}" />
                <div class="text">
                    <span class="contactname">${obj.FirstName || "-"} ${obj.LastName || "-"}</span>
                    <span class="contactjob">${obj.Job || "-"}</span>
                </div>
                `,
>>>>>>> origin/master
				height:66
			},
			on: {
				onAfterSelect: (id) => {
					this.getParentView().show("contactinfo", {target:"right"});
					this.show(`../contacts?id=${id}`);
				}
			}
		};

		return {
			css:"bg_color",
			rows: [
				contact_list,
				{gravity: 0.05},
				add_button
			]
		};
	}
	init() {
		this.list = this.$$("list");
		this.list.sync(contacts);

		contacts.waitData.then(() => {
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
<<<<<<< HEAD
			if (id) { this.list.select(id); }
=======
			if (id && id !== list.getSelectedId()) { list.select(id);}
>>>>>>> origin/master
		});
	}
}